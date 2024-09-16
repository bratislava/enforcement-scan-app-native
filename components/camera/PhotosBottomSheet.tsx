import BottomSheet from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'
import { useSharedValue } from 'react-native-reanimated'

import FlashlightBottomSheetAttachment from '@/components/camera/FlashlightBottomSheetAttachment'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'

type Props = {
  isLoading: boolean
  takePicture: () => Promise<void>
}

const PhotosBottomSheet = ({ isLoading, takePicture }: Props) => {
  const { t } = useTranslation()

  const animatedPosition = useSharedValue(0)

  return (
    <>
      <FlashlightBottomSheetAttachment animatedPosition={animatedPosition} />

      <BottomSheet
        handleComponent={null}
        keyboardBehavior="interactive"
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
