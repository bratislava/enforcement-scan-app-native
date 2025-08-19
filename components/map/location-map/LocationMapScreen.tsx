import BottomSheet from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import { Position } from 'geojson'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'

import { ChangeZoneModal } from '@/components/map/location-map/ChangeZoneModal'
import LocationMap from '@/components/map/location-map/LocationMap'
import LocationMapBottomSheet from '@/components/map/location-map/LocationMapBottomSheet'
import { MapRef } from '@/components/map/Map'
import { RoleItem } from '@/modules/backend/constants/roles'
import { OffenceTypeEnum } from '@/modules/backend/openapi-generated'
import { MapUdrZoneWithTranslationProps } from '@/modules/map/types'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

type Props = {
  role: RoleItem
}

export const OFFENCES_ALLOWED_OUTSIDE_ZONE: Set<OffenceTypeEnum | undefined> = new Set([
  OffenceTypeEnum.Dz,
])

const LocationMapScreen = ({ role }: Props) => {
  const zoneBottomSheetRef = useRef<BottomSheet>(null)
  const mapRef = useRef<MapRef>(null)

  const location = useOffenceStoreContext((state) => state.location)
  const offenceType = useOffenceStoreContext((state) => state.offenceType)
  const zoneUdrId = useOffenceStoreContext((state) => state.zone?.udrId)

  const { setOffenceState } = useSetOffenceState()

  const [isModalShown, setIsModalShown] = useState(false)
  const [selectedZone, setSelectedZone] = useState<MapUdrZoneWithTranslationProps | null>(null)

  const handleZoneChange = useCallback(
    (zone: MapUdrZoneWithTranslationProps | null) => {
      setSelectedZone(zone)
    },
    [setSelectedZone],
  )

  const [centerCoordinate, setCenterCoordinate] = useState(location)

  const isAllowedOutsideZone = OFFENCES_ALLOWED_OUTSIDE_ZONE.has(offenceType)

  const onLocationSelect = useCallback(() => {
    if (!isAllowedOutsideZone && role.actions.zone && zoneUdrId !== selectedZone?.udrId) {
      setIsModalShown(true)

      return
    }

    if (centerCoordinate) setOffenceState({ location: centerCoordinate })

    router.back()
  }, [
    isAllowedOutsideZone,
    role.actions.zone,
    zoneUdrId,
    selectedZone?.udrId,
    centerCoordinate,
    setOffenceState,
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

  const handleContinueToZone = useCallback(() => {
    if (centerCoordinate) {
      setOffenceState({ location: centerCoordinate })
    }
  }, [centerCoordinate, setOffenceState])

  return (
    <View className="flex-1 items-stretch">
      {centerCoordinate ? (
        <LocationMap
          ref={mapRef}
          onCenterChange={onCenterChange}
          selectedZone={selectedZone}
          onZoneChange={handleZoneChange}
        />
      ) : null}

      <LocationMapBottomSheet
        isDisabled={role?.actions.zone && !isAllowedOutsideZone ? !selectedZone : false}
        onPress={onLocationSelect}
        ref={zoneBottomSheetRef}
        flyTo={mapRef.current?.flyTo}
      />

      <ChangeZoneModal
        visible={isModalShown}
        onContinue={handleContinueToZone}
        onCloseModal={() => setIsModalShown(false)}
      />
    </View>
  )
}

export default LocationMapScreen
