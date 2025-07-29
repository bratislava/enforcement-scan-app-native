import { Portal } from '@gorhom/portal'
import { Camera, FillLayer, LineLayer, MapState, MapView, ShapeSource } from '@rnmapbox/maps'
import { Position } from 'geojson'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { View } from 'react-native'

import CompassButton from '@/components/map/CompassButton'
import { UserMapIndicator } from '@/components/map/location-map/UserMapIndicator'
import MapCamera from '@/components/map/MapCamera'
import MapPin from '@/components/map/MapPin'
import MapZones from '@/components/map/MapZones'
import { MAP_STYLE_URL } from '@/modules/map/constants'
import { useCameraChangeHandler } from '@/modules/map/hooks/useCameraChangeHandler'
import { getMapPadding } from '@/modules/map/hooks/useMapCenter'
import { useMapStoreUpdateContext } from '@/modules/map/state/MapStoreProvider/useMapStoreUpdateContext'
import { MapUdrZoneWithTranslationProps, UdrZoneFeature } from '@/modules/map/types'
import { udrStyles } from '@/modules/map/utils/layer-styles/visitors'

type Props = {
  onZoneChange?: (feature: MapUdrZoneWithTranslationProps | null) => void
  onMapPinVisibilityChange?: (isShown: boolean) => void
}

export type MapRef = {
  flyTo: (center: Position) => void
}

const ZOOM_ON_PLACE_SELECT = 16

const Map = forwardRef<MapRef, Props>(({ onZoneChange, onMapPinVisibilityChange }, ref) => {
  const camera = useRef<Camera>(null)
  const map = useRef<MapView>(null)
  const updateMapStoreContext = useMapStoreUpdateContext()
  const [selectedPolygon, setSelectedPolygon] = useState<UdrZoneFeature | null>(null)
  const [isMapPinShown, setIsMapPinShown] = useState(false)
  const [mapHeading, setMapHeading] = useState<number>(0)

  const onStateChange = async (mapState: MapState) => {
    setMapHeading(mapState.properties.heading)
  }

  const [newCameraHeading, setNewCameraHeading] = useState<number | null>(null)

  const selectedZone = useMemo(() => selectedPolygon?.properties, [selectedPolygon])

  useEffect(() => {
    onZoneChange?.(selectedPolygon?.properties ?? null)
  }, [selectedPolygon, onZoneChange])

  useEffect(() => {
    onMapPinVisibilityChange?.(isMapPinShown)
  }, [onMapPinVisibilityChange, isMapPinShown])

  const handleFlyTo = useCallback((center: Position, zoomLevel: number = ZOOM_ON_PLACE_SELECT) => {
    camera.current?.setCamera({
      centerCoordinate: center,
      zoomLevel,
      // both setCamera and flyTo function don't respect the padding set in the Camera component so it needs to be set again
      padding: getMapPadding(),
      animationMode: 'moveTo',
    })
  }, [])

  const handleRotateToNorth = useCallback(() => {
    setNewCameraHeading(0)
  }, [])

  useEffect(() => {
    if (newCameraHeading !== null) {
      camera.current?.setCamera({
        heading: newCameraHeading,
      })
      setNewCameraHeading(null)
    }
  }, [newCameraHeading])

  useEffect(() => {
    updateMapStoreContext({
      flyTo: (center) => {
        handleFlyTo(center)
      },
      rotateToNorth: handleRotateToNorth,
    })
  }, [updateMapStoreContext, handleFlyTo, handleRotateToNorth])

  useImperativeHandle(ref, () => ({ flyTo: handleFlyTo }), [handleFlyTo])

  const handleCameraChange = useCameraChangeHandler({
    isMapPinShown,
    map: map.current,
    selectedPolygon,
    setIsMapPinShown,
    setSelectedPolygon,
    onStateChange,
  })

  return (
    <View className="flex-1">
      <MapView
        ref={map}
        style={{ flex: 1 }}
        styleURL={MAP_STYLE_URL}
        onCameraChanged={handleCameraChange}
        scaleBarEnabled={false}
        pitchEnabled={false}
      >
        <MapCamera ref={camera} />

        <MapZones />

        <ShapeSource
          id="highlight"
          // the shape cannot be null or undefined, but we must render the ShapeSource, because if it is rendered later the z-index breaks
          shape={selectedPolygon ?? { coordinates: [], type: 'Polygon' }}
        >
          <FillLayer id="highlight" style={udrStyles.zoneFillSelected} />
          <LineLayer id="highlight-lines" style={udrStyles.lineSelected} />
        </ShapeSource>

        <UserMapIndicator />
      </MapView>

      {isMapPinShown && <MapPin showFullPin={!!selectedZone} />}

      <Portal hostName="mapRightBox">
        <CompassButton heading={mapHeading} />
      </Portal>
    </View>
  )
})

export default Map
