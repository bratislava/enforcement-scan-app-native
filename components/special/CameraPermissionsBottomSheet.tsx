import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { Camera, PermissionStatus } from 'expo-camera'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Linking, Platform, View } from 'react-native'

import AvatarCircleIcon from '@/components/info/AvatarCircleIcon'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import Button from '@/components/shared/Button'
import { useAppFocusEffect } from '@/hooks/useAppFocusEffect'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'

const CameraPermissionsBottomSheet = () => {
  const ref = useRef<BottomSheet>(null)
  const [CameraPermissionStatus, getCameraPermission] = useCameraPermission()
  const [isCameraOn, setIsCameraOn] = useState(true)

  const reloadCameraStatus = useCallback(async () => {
    if (CameraPermissionStatus === PermissionStatus.UNDETERMINED) {
      await getCameraPermission()
    }

    const { granted: isEnabled } = await Camera.getCameraPermissionsAsync()

    setIsCameraOn(isEnabled)
  }, [getCameraPermission, CameraPermissionStatus])

  const handleOpenSettingsPress = useCallback(async () => {
    if (CameraPermissionStatus !== PermissionStatus.GRANTED) {
      Linking.openSettings()
    } else if (!isCameraOn) {
      // https://copyprogramming.com/howto/react-native-open-settings-through-linking-openurl-in-ios
      if (Platform.OS === 'android') {
        Linking.sendIntent('android.settings.Camera_SOURCE_SETTINGS')
      } else if (Platform.OS === 'ios') {
        // TODO: test on iOS
        Linking.openURL('App-Prefs:root=Privacy&path=Camera')
        // Or this
        // Linking.openURL('App-Prefs:Privacy&path=Camera')
      }
    }
  }, [CameraPermissionStatus, isCameraOn])

  // This is done so that when user changes the Camera settings and refocuses the app
  // the bottom sheet will be updated
  useAppFocusEffect(reloadCameraStatus)

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
    reloadCameraStatus()
  }, [reloadCameraStatus])

  if (CameraPermissionStatus === PermissionStatus.GRANTED && isCameraOn) {
    return null
  }

  const translationKey =
    CameraPermissionStatus === PermissionStatus.GRANTED ? 'cameraOff' : 'cameraDenied'

  return (
    <BottomSheet
      ref={ref}
      key="CameraPermissionsBottomSheet"
      handleComponent={BottomSheetHandleWithShadow}
      enableDynamicSizing
      backdropComponent={renderBackdrop}
    >
      <BottomSheetContent>
        <ContentWithAvatar
          className="px-0 py-0 pb-3 g-3"
          title={translationKey}
          text={translationKey}
          customAvatarComponent={<AvatarCircleIcon name="no-photography" />}
        >
          <View className="flex-row justify-between g-3">
            <Button className="flex-1" variant="primary" onPress={handleOpenSettingsPress}>
              openSettings
            </Button>
          </View>
        </ContentWithAvatar>
      </BottomSheetContent>
    </BottomSheet>
  )
}

export default CameraPermissionsBottomSheet
