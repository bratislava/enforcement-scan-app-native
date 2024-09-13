import * as Location from 'expo-location'
import { ReactNode } from 'react'
import { View } from 'react-native'

import BottomSheetTopAttachment, {
  BottomSheetTopAttachmentProps,
} from '@/components/screen-layout/BottomSheet/BottomSheetTopAttachment'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import { useFlashlightContext } from '@/modules/camera/state/useFlashlightContext'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'

export type TorchState = 'on' | 'off'

type Props = Omit<BottomSheetTopAttachmentProps, 'children'> & {
  iconLeft?: ReactNode
}

const FlashlightBottomSheetAttachment = ({ iconLeft, ...restProps }: Props) => {
  const [permissionStatus] = useCameraPermission()

  const { torch, setTorch } = useFlashlightContext()

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
