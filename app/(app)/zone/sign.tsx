import { Camera, FillLayer, LineLayer, MapView, ShapeSource } from '@rnmapbox/maps'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import { Feature, Point, Position } from 'geojson'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

import ZoneBadge from '@/components/info/ZoneBadge'
import { UserMapIndicator } from '@/components/map/location-map/UserMapIndicator'
import MapSigns from '@/components/map/MapSigns'
import MapZones from '@/components/map/MapZones'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import FlexRow from '@/components/shared/FlexRow'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { Arcgis } from '@/modules/arcgis/types'
import { getZoneSignPhotosOptions } from '@/modules/backend/constants/queryOptions'
import { ResponseZoneSignPhotoPropertiesDto } from '@/modules/backend/openapi-generated'
import { CITY_BOUNDS, MAP_CENTER, MAP_STYLE_URL } from '@/modules/map/constants'
import { useGetNearestSign } from '@/modules/map/hooks/useGetNearestSign'
import { calculateDistance } from '@/modules/map/utils/calculateDistance'
import { getCurrentPositionAsync } from '@/modules/map/utils/getCurrentPositionAsync'
import { getZoneArea } from '@/modules/map/utils/getZoneArea'
import { zoneHighlightStyles } from '@/modules/map/utils/layer-styles/visitors'
import { useArcgisStoreContext } from '@/state/ArcgisStore/useArcgisStoreContext'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { createUrlFromImageObject } from '@/utils/createUrlFromImageObject'

const ZONE_PHOTO_CAMERA_ROUTE = '/zone/photo-camera'

const BOUNDS_PADDING = { paddingTop: 40, paddingBottom: 40, paddingLeft: 30, paddingRight: 30 }
const CLUSTER_ZOOM_DURATION_MS = 500

// A selected sign further away than this gets a warning, the inspector may have tapped the wrong one
const FAR_SIGN_DISTANCE_M = 150

type SelectedSignSummaryProps = {
  isLoading: boolean
  sign?: Feature<Point, Arcgis.SignPoint>
  distance: number | null
  todayPhoto?: ResponseZoneSignPhotoPropertiesDto
}

/**
 * Selected sign with its distance and, when the inspector photographed it today, a thumbnail
 */
const SelectedSignSummary = ({
  isLoading,
  sign,
  distance,
  todayPhoto,
}: SelectedSignSummaryProps) => {
  const { t } = useTranslation()

  if (isLoading) return <Typography>{t('zone.sign.loading')}</Typography>
  if (!sign) return <Typography>{t('zone.sign.hint')}</Typography>

  const distanceText =
    distance === null
      ? null
      : distance >= 1000
        ? t('zone.sign.distanceKm', { distance: (distance / 1000).toFixed(1) })
        : t('zone.sign.distance', { distance })

  return (
    // announce the selection change to screen readers
    <FlexRow className="items-center justify-start g-3" accessibilityLiveRegion="polite">
      {todayPhoto ? (
        <Image
          testID="zoneSignThumbnail"
          accessibilityLabel={t('zone.sign.todayPhoto')}
          source={{ uri: createUrlFromImageObject(todayPhoto) }}
          className="h-16 w-16 rounded border border-divider"
        />
      ) : null}

      <View className="flex-1">
        <Typography variant="default-bold" numberOfLines={1}>
          {t('zone.sign.selected', {
            type: t(`zone.sign.type.${sign.properties.typ_znacky}`),
            zone: sign.properties.zona?.trim(),
          })}
        </Typography>
        {distanceText ? <Typography numberOfLines={1}>{distanceText}</Typography> : null}
        {todayPhoto ? (
          <Typography variant="small" numberOfLines={1} className="text-placeholder">
            {t('zone.sign.todayPhotoInfo', { tag: todayPhoto.tag ?? '' })}
          </Typography>
        ) : null}
      </View>
    </FlexRow>
  )
}

const ZoneSignScreen = () => {
  const { t } = useTranslation()
  const { setOffenceState } = useSetOffenceState()
  const camera = useRef<Camera>(null)

  const zone = useOffenceStoreContext((state) => state.zone)
  const selectedSignId = useOffenceStoreContext((state) => state.zoneSignGlobalId)

  const { udrData, signData } = useArcgisStoreContext()
  const { getNearestSign } = useGetNearestSign()

  const [userCoords, setUserCoords] = useState<Location.LocationObjectCoords | null>(null)

  const zoneArea = useMemo(
    () => (udrData && zone ? getZoneArea(udrData, zone) : null),
    [udrData, zone],
  )

  // stable object, so a re-render (e.g. after a pin tap) does not move the camera back to the zone
  const cameraBounds = useMemo(
    () => (zoneArea ? { ...zoneArea.bounds, ...BOUNDS_PADDING } : null),
    [zoneArea],
  )

  useEffect(() => {
    getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      .then(({ coords }) => setUserCoords(coords))
      // without location there is no preselection, the user picks the sign manually
      .catch(() => {})
  }, [])

  // Preselect the sign nearest to the user, the user can change it by tapping another pin
  useEffect(() => {
    if (selectedSignId || !userCoords) return

    const nearestSign = getNearestSign(userCoords, zone?.udrId)
    if (nearestSign) {
      setOffenceState({ zoneSignGlobalId: nearestSign.properties.GlobalID })
    }
  }, [getNearestSign, selectedSignId, setOffenceState, userCoords, zone?.udrId])

  // A cluster tap zooms in until the cluster splits, so each sign can be tapped on its own
  const handleClusterPress = useCallback((center: Position, zoomLevel: number) => {
    camera.current?.setCamera({
      centerCoordinate: center,
      zoomLevel,
      animationMode: 'easeTo',
      animationDuration: CLUSTER_ZOOM_DURATION_MS,
    })
  }, [])

  const selectedSign = useMemo(
    () => signData?.features.find((feature) => feature.properties.GlobalID === selectedSignId),
    [signData, selectedSignId],
  )

  // the inspector's own photos from today (the backend returns only those), latest one of the selected sign
  const { data: todayPhotos } = useQueryWithFocusRefetch(getZoneSignPhotosOptions())
  const todaySignPhoto = useMemo(
    () =>
      todayPhotos?.photos
        .filter((photo) => !!selectedSignId && photo.globalId === selectedSignId)
        .sort((a, b) => b.id - a.id)[0],
    [todayPhotos, selectedSignId],
  )

  // with a photo the camera screen shows it for confirmation, without one it opens the camera
  const goToCamera = (zonePhoto?: ResponseZoneSignPhotoPropertiesDto) => {
    setOffenceState({ zonePhoto })
    router.push(ZONE_PHOTO_CAMERA_ROUTE)
  }

  const selectedSignDistance = useMemo(() => {
    if (!(selectedSign && userCoords)) return null

    const [longitude, latitude] = selectedSign.geometry.coordinates

    return Math.round(
      calculateDistance([latitude, longitude, userCoords.latitude, userCoords.longitude]) * 1000,
    )
  }, [selectedSign, userCoords])

  const warnings = useMemo(() => {
    if (!(selectedSign && zone)) return []

    const signZone = selectedSign.properties.zona?.trim()
    const zoneCode = zone.code?.trim()
    const expectedType = zone.udrId === '0' ? 'rezidenti' : 'zona'

    return [
      selectedSignDistance !== null && selectedSignDistance > FAR_SIGN_DISTANCE_M
        ? t('zone.sign.warning.far')
        : null,
      signZone && zoneCode && signZone !== zoneCode
        ? t('zone.sign.warning.otherZone', { signZone, zone: zoneCode })
        : null,
      selectedSign.properties.typ_znacky === expectedType ? null : t('zone.sign.warning.otherType'),
    ].filter((warning): warning is string => !!warning)
  }, [selectedSign, selectedSignDistance, t, zone])

  return (
    <ScreenView title={t('zone.sign.title')} className="flex-1">
      <MapView
        style={{ flex: 1 }}
        styleURL={MAP_STYLE_URL}
        scaleBarEnabled={false}
        pitchEnabled={false}
      >
        <Camera
          ref={camera}
          animationMode="none"
          maxBounds={CITY_BOUNDS}
          {...(cameraBounds
            ? { bounds: cameraBounds }
            : { centerCoordinate: MAP_CENTER, zoomLevel: 14 })}
        />

        <MapZones />

        {zoneArea ? (
          <ShapeSource id="zoneHighlight" shape={zoneArea.featureCollection}>
            <FillLayer id="zoneHighlightFill" style={zoneHighlightStyles.fill} />
            <LineLayer id="zoneHighlightLine" style={zoneHighlightStyles.line} />
          </ShapeSource>
        ) : null}

        <MapSigns
          selectedSignId={selectedSignId}
          onSignPress={(globalId) => setOffenceState({ zoneSignGlobalId: globalId })}
          onClusterPress={handleClusterPress}
        />

        <UserMapIndicator />
      </MapView>

      <View className="bg-white px-5 py-3 g-2">
        {zone ? (
          <FlexRow>
            <Typography variant="small" numberOfLines={1} className="flex-1 text-ellipsis">
              {zone.name}
            </Typography>
            <ZoneBadge label={zone.udrId} />
          </FlexRow>
        ) : null}

        <SelectedSignSummary
          isLoading={!signData}
          sign={selectedSign}
          distance={selectedSignDistance}
          todayPhoto={todaySignPhoto}
        />

        {warnings.length > 0 ? (
          <Panel className="bg-warning-light g-1">
            {warnings.map((warning) => (
              <Typography key={warning} variant="small">
                {warning}
              </Typography>
            ))}
          </Panel>
        ) : null}

        {selectedSign ? (
          <Typography variant="small" className="text-placeholder">
            {t('zone.sign.changeHint')}
          </Typography>
        ) : null}

        {todaySignPhoto ? (
          // the sign was already photographed today: reuse that photo or take a new one
          <FlexRow className="g-3">
            <Button
              testID="addPhoto"
              variant="secondary"
              className="flex-1"
              onPress={() => goToCamera()}
            >
              {t('zone.sign.newPhoto')}
            </Button>
            <Button
              testID="useZonePhoto"
              className="flex-1"
              onPress={() => goToCamera(todaySignPhoto)}
            >
              {t('zone.sign.useTodayPhoto')}
            </Button>
          </FlexRow>
        ) : (
          <ContinueButton
            testID="confirmZoneSign"
            disabled={!selectedSignId}
            onPress={() => goToCamera()}
          />
        )}
      </View>
    </ScreenView>
  )
}

export default ZoneSignScreen
