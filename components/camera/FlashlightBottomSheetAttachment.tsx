import { FlashMode } from 'expo-camera'
import * as Location from 'expo-location'
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

const FlashlightBottomSheetAttachment = ({ toggleFlashlight, flashMode, ...restProps }: Props) => {
  const [permissionStatus] = useCameraPermission()

  return (
    <BottomSheetTopAttachment {...restProps}>
      <FlexRow className="flex-1 items-end justify-end p-2.5 pt-0">
        <View>
          <IconButton
            name={flashMode === FlashMode.off ? 'flashlight-on' : 'flashlight-off'}
            accessibilityLabel="Flashlight"
            variant="white-raised"
            onPress={toggleFlashlight}
            disabled={permissionStatus === Location.PermissionStatus.DENIED}
          />
        </View>
      </FlexRow>
    </BottomSheetTopAttachment>
  )
}

export default FlashlightBottomSheetAttachment
