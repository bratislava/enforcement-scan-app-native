import * as Location from 'expo-location'
import { View } from 'react-native'

import BottomSheetTopAttachment, {
  BottomSheetTopAttachmentProps,
} from '@/components/screen-layout/BottomSheet/BottomSheetTopAttachment'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'

type Props = Omit<BottomSheetTopAttachmentProps, 'children'> & {
  onRetake: () => void
}

const PhotoBottomSheetAttachment = ({ onRetake, ...restProps }: Props) => {
  const [permissionStatus] = useCameraPermission()

  return (
    <BottomSheetTopAttachment {...restProps}>
      <FlexRow className="flex-1 items-end justify-end p-2.5 pt-0">
        <View>
          <IconButton
            name="cached"
            accessibilityLabel="Odfotiť znova"
            variant="white-raised"
            onPress={onRetake}
            disabled={permissionStatus === Location.PermissionStatus.DENIED}
          />
        </View>
      </FlexRow>
    </BottomSheetTopAttachment>
  )
}

export default PhotoBottomSheetAttachment
