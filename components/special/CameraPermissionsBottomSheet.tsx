import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'

import AvatarCircleIcon from '@/components/info/AvatarCircleIcon'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import Button from '@/components/shared/Button'
import { useAppFocusEffect } from '@/hooks/useAppFocusEffect'
import { PermissionStatuses } from '@/modules/camera/constants'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'

const CameraPermissionsBottomSheet = () => {
  const { t } = useTranslation()
  const ref = useRef<BottomSheet>(null)
  const [cameraPermissionStatus, getCameraPermission] = useCameraPermission()

  const reloadCameraStatus = useCallback(async () => {
    if (cameraPermissionStatus === PermissionStatuses.UNDETERMINED) {
      await getCameraPermission()
    }
  }, [getCameraPermission, cameraPermissionStatus])

  const handleOpenSettingsPress = useCallback(async () => {
    if (cameraPermissionStatus !== PermissionStatuses.GRANTED) {
      Linking.openSettings()
    }
  }, [cameraPermissionStatus])

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

  if (cameraPermissionStatus === PermissionStatuses.GRANTED) {
    return null
  }

  return (
    <BottomSheet
      ref={ref}
      key="CameraPermissionsBottomSheet"
      handleComponent={BottomSheetHandleWithShadow}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetContent>
        <ContentWithAvatar
          className="px-0 py-0 pb-3 g-3"
          title={t('permissions.camera.cameraDenied.title')}
          text={t('permissions.camera.cameraDenied.text')}
          customAvatarComponent={<AvatarCircleIcon name="no-photography" />}
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

export default CameraPermissionsBottomSheet
