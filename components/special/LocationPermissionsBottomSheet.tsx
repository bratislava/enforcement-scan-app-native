import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import * as Location from 'expo-location'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'

import AvatarCircleIcon from '@/components/info/AvatarCircleIcon'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import Button from '@/components/shared/Button'
import { useAppFocusEffect } from '@/hooks/useAppFocusEffect'
import { useLocationPermission } from '@/modules/permissions/useLocationPermission'

const LocationBottomSheet = () => {
  const { t } = useTranslation()
  const ref = useRef<BottomSheet>(null)
  const [locationPermissionStatus, getLocationPermission] = useLocationPermission()
  const [isLocationOn, setIsLocationOn] = useState(true)

  const reloadLocationStatus = useCallback(async () => {
    if (locationPermissionStatus === Location.PermissionStatus.UNDETERMINED) {
      await getLocationPermission()
    }

    const isEnabled = await Location.hasServicesEnabledAsync()

    setIsLocationOn(isEnabled)
  }, [getLocationPermission, locationPermissionStatus])

  const handleOpenSettingsPress = useCallback(async () => {
    if (locationPermissionStatus !== Location.PermissionStatus.GRANTED) {
      Linking.openSettings()
    } else if (!isLocationOn) {
      Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS')
    }
  }, [locationPermissionStatus, isLocationOn])

  // This is done so that when user changes the location settings and refocuses the app
  // the bottom sheet will be updated
  useAppFocusEffect(reloadLocationStatus)

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="none"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  )

  useEffect(() => {
    reloadLocationStatus()
  }, [reloadLocationStatus])

  if (locationPermissionStatus === Location.PermissionStatus.GRANTED && isLocationOn) {
    return null
  }

  return (
    <BottomSheet
      ref={ref}
      key="LocationBottomSheet"
      handleComponent={BottomSheetHandleWithShadow}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetContent>
        <ContentWithAvatar
          className="px-0 py-0 pb-3 g-3"
          title={
            isLocationOn
              ? t('permissions.location.locationDenied.title')
              : t('permissions.location.locationOff.title')
          }
          text={
            isLocationOn
              ? t('permissions.location.locationDenied.text')
              : t('permissions.location.locationOff.text')
          }
          customAvatarComponent={<AvatarCircleIcon name="location-disabled" />}
        >
          <View className="flex-row justify-between g-3">
            <Button className="flex-1" variant="primary" onPress={handleOpenSettingsPress}>
              {t('permissions.button')}
            </Button>
          </View>
        </ContentWithAvatar>
      </BottomSheetContent>
    </BottomSheet>
  )
}

export default LocationBottomSheet
