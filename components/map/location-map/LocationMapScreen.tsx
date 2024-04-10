import BottomSheet from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { router } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'

import LocationMap from '@/components/map/location-map/LocationMap'
import LocationMapBottomSheet from '@/components/map/location-map/LocationMapBottomSheet'
import { MapRef } from '@/components/map/Map'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { MapUdrZoneWithTranslationProps } from '@/modules/map/types'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const LocationMapScreen = () => {
  const zoneBottomSheetRef = useRef<BottomSheet>(null)
  const mapRef = useRef<MapRef>(null)

  const location = useOffenceStoreContext((state) => state.location)
  const roleKey = useOffenceStoreContext((state) => state.roleKey)
  const role = getRoleByKey(roleKey)
  const setState = useSetOffenceState()

  const [selectedZone, setSelectedZone] = useState<MapUdrZoneWithTranslationProps | null>(null)
  const handleZoneChange = useCallback(
    (zone: MapUdrZoneWithTranslationProps | null) => {
      setSelectedZone(zone)
    },
    [setSelectedZone],
  )

  const [centerCoordinate, setCenterCoordinate] = useState(location)

  const onLocationSelect = useCallback(() => {
    if (centerCoordinate) setState({ location: centerCoordinate })
    router.back()
  }, [centerCoordinate, setState])

  return (
    <View className="flex-1 items-stretch">
      {centerCoordinate ? (
        <LocationMap
          ref={mapRef}
          centerCoordinate={centerCoordinate}
          setCenterCoordinate={setCenterCoordinate}
          selectedZone={selectedZone}
          onZoneChange={handleZoneChange}
        />
      ) : null}

      <Portal hostName="locationIndex">
        <LocationMapBottomSheet
          isDisabled={role?.actions.zone ? !selectedZone : false}
          onPress={onLocationSelect}
          ref={zoneBottomSheetRef}
          setFlyToCenter={mapRef.current?.setFlyToCenter}
        />
      </Portal>
    </View>
  )
}

export default LocationMapScreen
