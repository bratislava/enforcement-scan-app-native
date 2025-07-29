import { Camera } from '@rnmapbox/maps'
import { Position } from 'geojson'
import { forwardRef, useEffect, useRef } from 'react'

import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { CITY_BOUNDS, MAP_CENTER } from '@/modules/map/constants'
import { useLocation } from '@/modules/map/hooks/useLocation'
import { getMapPadding } from '@/modules/map/hooks/useMapCenter'
import { isWithinCityBounds } from '@/modules/map/utils/isWithinCityBounds'

export const ZOOM_ON_PLACE_SELECT = 15
const DEFAULT_ZOOM = 14

type Props = {
  cameraZoom?: number
  centerCoordinate?: [number, number]
}

const MapCamera = forwardRef<Camera, Props>(
  ({ cameraZoom = DEFAULT_ZOOM, centerCoordinate }, ref) => {
    const localRef = useRef<Camera>(null)
    const refSetter = useMultipleRefsSetter(localRef, ref)

    const [location] = useLocation()

    const flyToCoordinate = (center: Position) => {
      localRef.current?.setCamera({
        centerCoordinate: center,
        zoomLevel: ZOOM_ON_PLACE_SELECT,
        // both setCamera and flyTo function don't respect the padding set in the Camera component so it needs to be set again
        padding: getMapPadding(),
      })
    }

    useEffect(() => {
      if (isWithinCityBounds(location) && location && !centerCoordinate) {
        flyToCoordinate([location.coords.longitude, location.coords.latitude])
      }
    }, [centerCoordinate, location])

    return (
      <Camera
        ref={refSetter}
        followUserLocation={false}
        animationMode="moveTo"
        zoomLevel={cameraZoom}
        centerCoordinate={centerCoordinate ?? MAP_CENTER}
        maxBounds={CITY_BOUNDS}
        padding={getMapPadding()}
      />
    )
  },
)

export default MapCamera
