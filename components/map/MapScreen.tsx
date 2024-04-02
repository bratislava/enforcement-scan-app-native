import BottomSheet from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'

import Map, { MapRef } from '@/components/map/Map'
import MapZoneBottomSheet from '@/components/map/MapZoneBottomSheet'
import { useProcessedArcgisData } from '@/modules/map/hooks/useProcessedArcgisData'
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

  const { isLoading, ...processedData } = useProcessedArcgisData()

  return (
    <View className="flex-1 items-stretch">
      <Map
        ref={mapRef}
        onZoneChange={handleZoneChange}
        processedData={processedData}
        onMapPinVisibilityChange={handleMapPinVisibilityChange}
      />

      <Portal hostName="index">
        <MapZoneBottomSheet
          ref={zoneBottomSheetRef}
          zone={selectedZone}
          setFlyToCenter={mapRef.current?.setFlyToCenter}
          isZoomedOut={!isMapPinShown}
        />
      </Portal>
    </View>
  )
}

export default MapScreen
