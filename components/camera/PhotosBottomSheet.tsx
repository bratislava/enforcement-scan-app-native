import BottomSheet from '@gorhom/bottom-sheet'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSharedValue } from 'react-native-reanimated'

import FlashlightBottomSheetAttachment, {
  FlashLightProps,
} from '@/components/camera/FlashlightBottomSheetAttachment'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'

type Props = FlashLightProps & {
  isLoading: boolean
  takePicture: () => Promise<void>
}

const PhotosBottomSheet = ({ isLoading, takePicture, ...rest }: Props) => {
  const { t } = useTranslation()
  const modalRef = useRef<BottomSheet>(null)

  const animatedPosition = useSharedValue(0)

  return (
    <>
      <FlashlightBottomSheetAttachment {...rest} animatedPosition={animatedPosition} />

      <BottomSheet
        handleComponent={null}
        keyboardBehavior="interactive"
        ref={modalRef}
        enableDynamicSizing
        animatedPosition={animatedPosition}
      >
        <BottomSheetContent className="g-2">
          <Typography variant="h2">{t('offenceCamera.addPictureTitle')}</Typography>
          <Button loading={isLoading} onPress={takePicture}>
            {t('offenceCamera.addPicture')}
          </Button>
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
}

export default PhotosBottomSheet
