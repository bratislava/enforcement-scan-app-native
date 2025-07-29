import { Camera, FillLayer, LineLayer, MapView, ShapeSource } from '@rnmapbox/maps'
import { Position } from 'geojson'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { UserMapIndicator } from '@/components/map/location-map/UserMapIndicator'
import MapCamera from '@/components/map/MapCamera'
import MapPin from '@/components/map/MapPin'
import MapZones from '@/components/map/MapZones'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { LOCATION_PREVIEW_DEFAULT_ZOOM, MAP_STYLE_URL } from '@/modules/map/constants'
import { useCameraChangeHandler } from '@/modules/map/hooks/useCameraChangeHandler'
import { getMapPadding } from '@/modules/map/hooks/useMapCenter'
import { MapUdrZoneWithTranslationProps, UdrZoneFeature } from '@/modules/map/types'
import { udrStyles } from '@/modules/map/utils/layer-styles/visitors'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'

type Props = {
  selectedZone: MapUdrZoneWithTranslationProps | null
  onCenterChange: (center: Position) => void
  onZoneChange?: (feature: MapUdrZoneWithTranslationProps | null) => void
}

// TODO: Consider merging with Map component (they have very similar structure)
const LocationMap = forwardRef(({ selectedZone, onCenterChange, onZoneChange }: Props, ref) => {
  const map = useRef<MapView>(null)
  const camera = useRef<Camera>(null)

  const location = useOffenceStoreContext((state) => state.location)
  const roleKey = useOffenceStoreContext((state) => state.roleKey)
  const role = getRoleByKey(roleKey)

  const [selectedPolygon, setSelectedPolygon] = useState<UdrZoneFeature | null>(null)

  useEffect(() => {
    onZoneChange?.(selectedPolygon?.properties ?? null)
  }, [selectedPolygon, onZoneChange])

  const handleFlyTo = useCallback(
    (center: Position, zoomLevel: number = LOCATION_PREVIEW_DEFAULT_ZOOM) => {
      camera.current?.setCamera({
        centerCoordinate: center,
        zoomLevel,
        // both setCamera and flyTo function don't respect the padding set in the Camera component so it needs to be set again
        padding: getMapPadding(),
        animationMode: 'moveTo',
      })
    },
    [],
  )
  useImperativeHandle(ref, () => ({ flyTo: handleFlyTo }), [handleFlyTo])

  const handleCameraChange = useCameraChangeHandler({
    isMapPinShown: true,
    map: map.current,
    selectedPolygon,
    setSelectedPolygon,
    onCenterChange,
  })

  return location ? (
    <>
      <MapView
        ref={map}
        style={{ flex: 1 }}
        styleURL={MAP_STYLE_URL}
        onCameraChanged={handleCameraChange}
        scaleBarEnabled={false}
      >
        <MapCamera
          ref={camera}
          cameraZoom={LOCATION_PREVIEW_DEFAULT_ZOOM}
          centerCoordinate={[location.long, location.lat]}
        />

        {role?.actions.zone ? <MapZones /> : null}

        <ShapeSource
          id="highlight"
          // the shape cannot be null or undefined, but we must render the ShapeSource, because if it is rendered later the z-index breaks
          shape={selectedPolygon ?? { coordinates: [], type: 'Polygon' }}
        >
          <FillLayer id="highlight-background" style={udrStyles.zoneFillSelected} />
          <LineLayer id="highlight-lines" style={udrStyles.lineSelected} />
        </ShapeSource>

        <UserMapIndicator />
      </MapView>

      <MapPin showFullPin={role?.actions.zone ? !!selectedZone : true} />
    </>
  ) : null
})

export default LocationMap
