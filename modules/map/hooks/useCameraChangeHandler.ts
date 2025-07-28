import { MapState, MapView } from '@rnmapbox/maps'
import { Position } from 'geojson'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { Keyboard, Platform, useWindowDimensions } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import { useMapCenter } from '@/modules/map/hooks/useMapCenter'
import { UdrZoneFeature } from '@/modules/map/types'
import { interpolate } from '@/utils/interpolate'

const HIDE_MARKER_ON_ZOOM_OVER = 13.5
const DEBOUNCE_TIME = 50
const QUERY_RECT_SIZE = 5

type Dependencies = {
  map: MapView | null
  isMapPinShown: boolean
  selectedPolygon: UdrZoneFeature | null
  setSelectedPolygon: Dispatch<SetStateAction<UdrZoneFeature | null>>
  setIsMapPinShown?: Dispatch<SetStateAction<boolean>>
  onStateChange?: (state: MapState) => void
  onCenterChange?: (center: Position) => void
}

export const useCameraChangeHandler = ({
  map,
  isMapPinShown,
  selectedPolygon,
  setSelectedPolygon,
  setIsMapPinShown,
  onStateChange,
  onCenterChange,
}: Dependencies) => {
  const { scale } = useWindowDimensions()
  // screen center is needed to get coordinates of the center of the map
  const screenCenter = useMapCenter({ safeArea: true })
  // scaled center is needed to query features at the center of the map
  const scaledCenter = useMapCenter({ safeArea: true, scale: Platform.OS === 'android' })
  const [lastCenter, setLastCenter] = useState<number[]>([0, 0])

  const getCurrentPolygon = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (state: MapState) => {
      const rectSize = (QUERY_RECT_SIZE / 2) * (Platform.OS === 'android' ? scale : 1)
      const rectHalfSize = interpolate(state.properties.zoom, [13.5, 15], [0, rectSize])
      // this feature needs scaled center on android to be calculated correctly
      const featuresAtCenter = await map?.queryRenderedFeaturesInRect(
        [
          scaledCenter.top + rectHalfSize,
          scaledCenter.left + rectHalfSize,
          scaledCenter.top - rectHalfSize,
          scaledCenter.left - rectHalfSize,
        ],
        null,
        ['udrFill', 'udrFill2'],
      )

      // this feature needs screen center that is not scaled to be calculated correctly
      const point = await map?.getCoordinateFromView([screenCenter.left, screenCenter.top])

      if (point) onCenterChange?.(point)
      else onCenterChange?.(state.properties.center)

      if (!featuresAtCenter?.features?.length) {
        setSelectedPolygon(null)
      } else if (isMapPinShown) {
        const feature = featuresAtCenter.features[0] as UdrZoneFeature
        if (feature.properties.id !== selectedPolygon?.properties.id) {
          setSelectedPolygon(feature)
        }
      }
    },
    [
      scale,
      map,
      scaledCenter,
      screenCenter,
      onCenterChange,
      isMapPinShown,
      setSelectedPolygon,
      selectedPolygon?.properties.id,
    ],
  )

  const debouncedHandleCameraChange = useDebouncedCallback((state: MapState) => {
    getCurrentPolygon(state)
  }, DEBOUNCE_TIME)

  return useCallback(
    (state: MapState) => {
      onStateChange?.(state)
      if (
        lastCenter[0] === state.properties.center[0] &&
        lastCenter[1] === state.properties.center[1]
      ) {
        return
      }
      setLastCenter(state.properties.center)
      if (!Keyboard.isVisible()) {
        debouncedHandleCameraChange(state)
        if (state.properties.zoom < HIDE_MARKER_ON_ZOOM_OVER) {
          setIsMapPinShown?.(false)
        } else {
          setIsMapPinShown?.(true)
        }
      }
    },
    [debouncedHandleCameraChange, setIsMapPinShown, lastCenter, onStateChange],
  )
}
