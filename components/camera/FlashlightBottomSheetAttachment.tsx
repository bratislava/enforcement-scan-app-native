import { FlashMode } from 'expo-camera'
import * as Location from 'expo-location'
import { Dispatch, ReactNode, SetStateAction } from 'react'
import { View } from 'react-native'

import BottomSheetTopAttachment, {
  BottomSheetTopAttachmentProps,
} from '@/components/screen-layout/BottomSheet/BottomSheetTopAttachment'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'

export type FlashLightProps = {
  flashMode: FlashMode
  setFlashMode: Dispatch<SetStateAction<FlashMode>>
}

type Props = Omit<BottomSheetTopAttachmentProps, 'children'> & {
  iconLeft?: ReactNode
} & FlashLightProps

const FlashlightBottomSheetAttachment = ({
  setFlashMode,
  iconLeft,
  flashMode,
  ...restProps
}: Props) => {
  const [permissionStatus] = useCameraPermission()

  return (
    <BottomSheetTopAttachment {...restProps}>
      <FlexRow className="flex-1 items-end justify-between p-2.5 pt-0">
        {iconLeft || <View />}

        <IconButton
          name={flashMode === FlashMode.off ? 'flashlight-on' : 'flashlight-off'}
          accessibilityLabel="Flashlight"
          variant="white-raised"
          // flash doesn't get triggered when value of FlashMode is "on"... the "torch" value works fine
          onPress={() =>
            setFlashMode((prev) => (prev === FlashMode.off ? FlashMode.torch : FlashMode.off))
          }
          disabled={permissionStatus === Location.PermissionStatus.DENIED}
        />
      </FlexRow>
    </BottomSheetTopAttachment>
  )
}

export default FlashlightBottomSheetAttachment
