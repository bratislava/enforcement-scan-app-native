import BottomSheet from '@gorhom/bottom-sheet'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'

import Map, { MapRef } from '@/components/map/Map'
import MapZoneBottomSheet from '@/components/map/MapZoneBottomSheet'
import { MapUdrZoneWithTranslationProps } from '@/modules/map/types'

const MapScreen = () => {
  const zoneBottomSheetRef = useRef<BottomSheet>(null)
  const mapRef = useRef<MapRef>(null)

  const [selectedZone, setSelectedZone] = useState<MapUdrZoneWithTranslationProps | null>(null)
  const [isMapPinShown, setIsMapPinShown] = useState(false)

  const handleMapPinVisibilityChange = useCallback((isShown: boolean) => {
    setIsMapPinShown(isShown)
  }, [])

  const handleZoneChange = useCallback(
    (zone: MapUdrZoneWithTranslationProps | null) => {
      setSelectedZone(zone)
    },
    [setSelectedZone],
  )

  return (
    <View className="flex-1 items-stretch">
      <Map
        ref={mapRef}
        onZoneChange={handleZoneChange}
        onMapPinVisibilityChange={handleMapPinVisibilityChange}
      />

      <MapZoneBottomSheet
        ref={zoneBottomSheetRef}
        zone={selectedZone}
        flyTo={mapRef.current?.flyTo}
        isZoomedOut={!isMapPinShown}
      />
    </View>
  )
}

export default MapScreen
