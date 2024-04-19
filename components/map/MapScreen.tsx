import BottomSheet from '@gorhom/bottom-sheet'
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'

import Map, { MapRef } from '@/components/map/Map'
import MapZoneBottomSheet from '@/components/map/MapZoneBottomSheet'
import { MapUdrZoneWithTranslationProps } from '@/modules/map/types'
import { useArcgisStoreContext } from '@/state/ArcgisStore/useArcgisStoreContext'
import { PositionObject } from '@/state/OffenceStore/OffenceStoreProvider'

const MapScreen = () => {
  const zoneBottomSheetRef = useRef<BottomSheet>(null)
  const mapRef = useRef<MapRef>(null)

  const [centerCoordinate, setCenterCoordinate] = useState<PositionObject>()
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

  const { isLoading, ...processedData } = useArcgisStoreContext()

  const onCenterChange = useCallback(
    (center: Position) => {
      setCenterCoordinate({
        lat: center[1], // lat is second in Position type
        long: center[0], // long is first in Position type
      })
    },
    [setCenterCoordinate],
  )

  return (
    <View className="flex-1 items-stretch">
      <Map
        ref={mapRef}
        onZoneChange={handleZoneChange}
        processedData={processedData}
        onCenterChange={onCenterChange}
        onMapPinVisibilityChange={handleMapPinVisibilityChange}
      />

      <MapZoneBottomSheet
        ref={zoneBottomSheetRef}
        zone={selectedZone}
        centerCoordinate={centerCoordinate}
        setFlyToCenter={mapRef.current?.setFlyToCenter}
        isZoomedOut={!isMapPinShown}
      />
    </View>
  )
}

export default MapScreen
