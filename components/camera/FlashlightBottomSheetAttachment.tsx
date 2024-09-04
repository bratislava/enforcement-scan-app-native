import * as Location from 'expo-location'
import { Dispatch, ReactNode, SetStateAction } from 'react'
import { View } from 'react-native'

import BottomSheetTopAttachment, {
  BottomSheetTopAttachmentProps,
} from '@/components/screen-layout/BottomSheet/BottomSheetTopAttachment'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'

export type TorchState = 'on' | 'off'

export type FlashLightProps = {
  torch: TorchState
  setTorch: Dispatch<SetStateAction<TorchState>>
}

type Props = Omit<BottomSheetTopAttachmentProps, 'children'> & {
  iconLeft?: ReactNode
} & FlashLightProps

const FlashlightBottomSheetAttachment = ({ setTorch, iconLeft, torch, ...restProps }: Props) => {
  const [permissionStatus] = useCameraPermission()

  return (
    <BottomSheetTopAttachment {...restProps}>
      <FlexRow className="flex-1 items-end justify-between p-2.5 pt-0">
        {iconLeft || <View />}

        <IconButton
          name={torch === 'off' ? 'flashlight-on' : 'flashlight-off'}
          accessibilityLabel="Flashlight"
          variant="white-raised"
          onPress={() => setTorch((prev) => (prev === 'off' ? 'on' : 'off'))}
          disabled={permissionStatus === Location.PermissionStatus.DENIED}
        />
      </FlexRow>
    </BottomSheetTopAttachment>
  )
}

export default FlashlightBottomSheetAttachment
