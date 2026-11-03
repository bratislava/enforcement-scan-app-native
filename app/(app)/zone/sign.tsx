import { Camera, FillLayer, LineLayer, MapView, ShapeSource } from '@rnmapbox/maps'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ZoneBadge from '@/components/info/ZoneBadge'
import { UserMapIndicator } from '@/components/map/location-map/UserMapIndicator'
import MapSigns from '@/components/map/MapSigns'
import MapZones from '@/components/map/MapZones'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenView from '@/components/screen-layout/ScreenView'
import FlexRow from '@/components/shared/FlexRow'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { CITY_BOUNDS, MAP_CENTER, MAP_STYLE_URL } from '@/modules/map/constants'
import { useGetNearestSign } from '@/modules/map/hooks/useGetNearestSign'
import { calculateDistance } from '@/modules/map/utils/calculateDistance'
import { getCurrentPositionAsync } from '@/modules/map/utils/getCurrentPositionAsync'
import { getZoneArea } from '@/modules/map/utils/getZoneArea'
import { udrStyles } from '@/modules/map/utils/layer-styles/visitors'
import { useArcgisStoreContext } from '@/state/ArcgisStore/useArcgisStoreContext'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const ZONE_PHOTO_CAMERA_ROUTE = '/zone/photo-camera'

const BOUNDS_PADDING = { paddingTop: 40, paddingBottom: 40, paddingLeft: 30, paddingRight: 30 }

const ZoneSignScreen = () => {
  const { t } = useTranslation()
  const { setOffenceState } = useSetOffenceState()

  const zone = useOffenceStoreContext((state) => state.zone)
  const selectedSignId = useOffenceStoreContext((state) => state.zoneSignGlobalId)

  const { udrData, signData } = useArcgisStoreContext()
  const { getNearestSign } = useGetNearestSign()

  const [userCoords, setUserCoords] = useState<Location.LocationObjectCoords | null>(null)
  const isPreselected = useRef(false)

  const zoneArea = useMemo(
    () => (udrData && zone ? getZoneArea(udrData, zone) : null),
    [udrData, zone],
  )

  useEffect(() => {
    getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      .then(({ coords }) => setUserCoords(coords))
      // without location there is no preselection, the user picks the sign manually
      .catch(() => setUserCoords(null))
  }, [])

  // Preselect the sign nearest to the user, the user can change it by tapping another pin
  useEffect(() => {
    if (isPreselected.current || selectedSignId || !userCoords) return

    const nearestSign = getNearestSign(userCoords, zone?.udrId)
    if (nearestSign) {
      isPreselected.current = true
      setOffenceState({ zoneSignGlobalId: nearestSign.properties.GlobalID })
    }
  }, [getNearestSign, selectedSignId, setOffenceState, userCoords, zone?.udrId])

  const selectedSign = useMemo(
    () => signData?.features.find((feature) => feature.properties.GlobalID === selectedSignId),
    [signData, selectedSignId],
  )

  const selectedSignDistance = useMemo(() => {
    if (!(selectedSign && userCoords)) return null

    const [longitude, latitude] = selectedSign.geometry.coordinates

    return Math.round(
      calculateDistance([latitude, longitude, userCoords.latitude, userCoords.longitude]) * 1000,
    )
  }, [selectedSign, userCoords])

  return (
    <ScreenView title={t('zone.sign.title')} className="flex-1">
      <MapView
        style={{ flex: 1 }}
        styleURL={MAP_STYLE_URL}
        scaleBarEnabled={false}
        pitchEnabled={false}
      >
        <Camera
          animationMode="none"
          maxBounds={CITY_BOUNDS}
          {...(zoneArea
            ? { bounds: { ...zoneArea.bounds, ...BOUNDS_PADDING } }
            : { centerCoordinate: MAP_CENTER, zoomLevel: 14 })}
        />

        <MapZones />

        {zoneArea ? (
          <ShapeSource id="zoneHighlight" shape={zoneArea.featureCollection}>
            <FillLayer id="zoneHighlightFill" style={udrStyles.zoneFillSelected} />
            <LineLayer id="zoneHighlightLine" style={udrStyles.lineSelected} />
          </ShapeSource>
        ) : null}

        <MapSigns
          selectedSignId={selectedSignId}
          onSignPress={(globalId) => setOffenceState({ zoneSignGlobalId: globalId })}
        />

        <UserMapIndicator />
      </MapView>

      <View className="bg-white px-5 py-3 g-3">
        {zone ? (
          <Panel className="g-2">
            <FlexRow>
              <Typography numberOfLines={1} className="flex-1 text-ellipsis">
                {zone.name}
              </Typography>
              <ZoneBadge label={zone.udrId} />
            </FlexRow>
          </Panel>
        ) : null}

        <Typography>
          {selectedSign
            ? [
                t('zone.sign.selected', {
                  type: t(`zone.sign.type.${selectedSign.properties.typ_znacky}`),
                  zone: selectedSign.properties.zona?.trim(),
                }),
                selectedSignDistance === null
                  ? null
                  : t('zone.sign.distance', { distance: selectedSignDistance }),
              ]
                .filter(Boolean)
                .join(' · ')
            : t('zone.sign.hint')}
        </Typography>

        <ContinueButton
          disabled={!selectedSignId}
          onPress={() => router.push(ZONE_PHOTO_CAMERA_ROUTE)}
        />
      </View>
    </ScreenView>
  )
}

export default ZoneSignScreen
