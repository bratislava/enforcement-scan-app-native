import { Camera, FillLayer, LineLayer, MapView, ShapeSource, UserLocation } from '@rnmapbox/maps'
import { Position } from 'geojson'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import LocationMapZones from '@/components/map/location-map/LocationMapZones'
import MapCamera from '@/components/map/MapCamera'
import MapPin from '@/components/map/MapPin'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { LOCATION_PREVIEW_DEFAULT_ZOOM, MAP_STYLE_URL } from '@/modules/map/constants'
import { useCameraChangeHandler } from '@/modules/map/hooks/useCameraChangeHandler'
import { MapUdrZoneWithTranslationProps, UdrZoneFeature } from '@/modules/map/types'
import { udrStyles } from '@/modules/map/utils/layer-styles/visitors'
import { PositionObject } from '@/state/OffenceStore/OffenceStoreProvider'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'

type Props = {
  selectedZone: MapUdrZoneWithTranslationProps | null
  centerCoordinate: PositionObject
  setCenterCoordinate: (center: PositionObject) => void
  onZoneChange?: (feature: MapUdrZoneWithTranslationProps | null) => void
}

const LocationMap = forwardRef(
  ({ selectedZone, centerCoordinate, setCenterCoordinate, onZoneChange }: Props, ref) => {
    const map = useRef<MapView>(null)
    const camera = useRef<Camera>(null)

    const [flyToCenter, setFlyToCenter] = useState<Position | null>([
      centerCoordinate.long,
      centerCoordinate.lat,
    ])

    const roleKey = useOffenceStoreContext((state) => state.roleKey)
    const role = getRoleByKey(roleKey)

    const [selectedPolygon, setSelectedPolygon] = useState<UdrZoneFeature | null>(null)

    useEffect(() => {
      onZoneChange?.(selectedPolygon?.properties ?? null)
    }, [selectedPolygon, onZoneChange])

    const handleSetFlyToCenter = useCallback((center: Position) => {
      setFlyToCenter(center)
    }, [])

    useImperativeHandle(ref, () => ({ setFlyToCenter: handleSetFlyToCenter }), [
      handleSetFlyToCenter,
    ])

    const onCenterChange = useCallback(
      (center: Position) => {
        setCenterCoordinate({
          lat: center[1], // lat is second in Position type
          long: center[0], // long is first in Position type
        })
      },
      [setCenterCoordinate],
    )

    const handleCameraChange = useCameraChangeHandler({
      isMapPinShown: true,
      map: map.current,
      selectedPolygon,
      setSelectedPolygon,
      setFlyToCenter,
      onCenterChange,
    })

    return centerCoordinate ? (
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
            flyToCenter={flyToCenter}
            setFlyToCenter={setFlyToCenter}
          />

          {role?.actions.zone ? <LocationMapZones /> : null}

          <ShapeSource
            id="highlight"
            // the shape cannot be null or undefined, but we must render the ShapeSource, because if it is rendered later the z-index breaks
            shape={selectedPolygon ?? { coordinates: [], type: 'Polygon' }}
          >
            <FillLayer id="highlight" style={udrStyles.zoneFillSelected} />
            <LineLayer id="higlight-lines" style={udrStyles.lineSelected} />
          </ShapeSource>

          <UserLocation androidRenderMode="gps" visible minDisplacement={3} animated />
        </MapView>

        <MapPin isZoneSelected={role?.actions.zone ? !!selectedZone : true} />
      </>
    ) : null
  },
)

export default LocationMap
