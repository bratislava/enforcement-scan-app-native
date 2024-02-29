import { FlashMode } from 'expo-camera'
import * as Location from 'expo-location'
import { useCallback } from 'react'
import { View } from 'react-native'

import BottomSheetTopAttachment, {
  BottomSheetTopAttachmentProps,
} from '@/components/screen-layout/BottomSheet/BottomSheetTopAttachment'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'

type Props = Omit<BottomSheetTopAttachmentProps, 'children'> & {
  flashMode: FlashMode
  toggleFlashlight: () => void
}

const CameraBottomSheetAttachment = ({ toggleFlashlight, flashMode, ...restProps }: Props) => {
  const [permissionStatus] = useCameraPermission()

  const onLocationPress = useCallback(async () => {
    toggleFlashlight()
  }, [toggleFlashlight])

  return (
    <BottomSheetTopAttachment {...restProps}>
      <FlexRow className="flex-1 items-end justify-end p-2.5 pt-0">
        <View>
          <IconButton
            name={flashMode ? 'flashlight-off' : 'flashlight-on'}
            accessibilityLabel="Flashlight"
            variant="white-raised"
            onPress={onLocationPress}
            disabled={permissionStatus === Location.PermissionStatus.DENIED}
          />
        </View>
      </FlexRow>
    </BottomSheetTopAttachment>
  )
}

export default CameraBottomSheetAttachment
