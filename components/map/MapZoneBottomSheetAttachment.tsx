import * as Location from 'expo-location'
import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'

import { MapRef } from '@/components/map/Map'
import BottomSheetTopAttachment, {
  BottomSheetTopAttachmentProps,
} from '@/components/screen-layout/BottomSheet/BottomSheetTopAttachment'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import { useLocationPermission } from '@/modules/permissions/useLocationPermission'
import { cn } from '@/utils/cn'

/** Time after pressing the button when it cannot be pressed again */
const LOCATION_REQUEST_THROTTLE = 500 // ms
const LOCATION_REQUEST_TIMEOUT = 500 // ms

type Props = Omit<BottomSheetTopAttachmentProps, 'children'> & {
  setFlyToCenter?: MapRef['setFlyToCenter']
}

const MapZoneBottomSheetAttachment = ({ setFlyToCenter, ...restProps }: Props) => {
  const [permissionStatus] = useLocationPermission()
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isButtonDisabledTimeout, setIsButtonDisabledTimeout] = useState<NodeJS.Timeout | null>(
    null,
  )
  const [requestTimeout, setRequestTimeout] = useState<NodeJS.Timeout | null>(null)

  const onLocationPress = useCallback(async () => {
    if (permissionStatus !== Location.PermissionStatus.DENIED) {
      setIsButtonDisabled(true)
      try {
        const location = await Promise.race<Location.LocationObject | null>([
          Location.getLastKnownPositionAsync(),
          new Promise((resolve) => {
            setRequestTimeout(setTimeout(() => resolve(null), LOCATION_REQUEST_TIMEOUT))
          }),
        ])
        if (location) {
          setFlyToCenter?.([location.coords.longitude, location.coords.latitude])
        }
        setIsButtonDisabledTimeout(
          setTimeout(() => {
            setIsButtonDisabled(false)
            setIsButtonDisabledTimeout(null)
          }, LOCATION_REQUEST_THROTTLE),
        )
      } catch (error) {
        setIsButtonDisabled(false)
      }
    }
  }, [setFlyToCenter, permissionStatus])

  useEffect(() => {
    return () => {
      if (isButtonDisabledTimeout) {
        clearTimeout(isButtonDisabledTimeout)
      }
    }
  }, [isButtonDisabledTimeout])

  useEffect(() => {
    return () => {
      if (requestTimeout) {
        clearTimeout(requestTimeout)
      }
    }
  }, [requestTimeout])

  return (
    <BottomSheetTopAttachment {...restProps}>
      <FlexRow className={cn('flex-1 items-end justify-end p-2.5 pt-0')}>
        <View>
          <IconButton
            name="gps-fixed"
            accessibilityLabel="goToUserLocation"
            variant="white-raised"
            onPress={onLocationPress}
            disabled={isButtonDisabled || permissionStatus === Location.PermissionStatus.DENIED}
          />
        </View>
      </FlexRow>
    </BottomSheetTopAttachment>
  )
}

export default MapZoneBottomSheetAttachment
