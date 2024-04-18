import BottomSheet from '@gorhom/bottom-sheet'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSharedValue } from 'react-native-reanimated'

import FlashlightBottomSheetAttachment, {
  FlashLightProps,
} from '@/components/camera/FlashlightBottomSheetAttachment'
import PhotoBottomSheetAttachment from '@/components/camera/PhotoBottomSheetAttachment'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'

type Props = FlashLightProps & {
  isLoading: boolean
  hasPhoto: boolean
  takePicture: () => Promise<void>
  retakePicture: () => void
  selectPicture: () => void
}

const CameraBottomSheet = ({
  hasPhoto,
  isLoading,
  takePicture,
  selectPicture,
  retakePicture,
  ...rest
}: Props) => {
  const { t } = useTranslation()
  const modalRef = useRef<BottomSheet>(null)

  const animatedPosition = useSharedValue(0)

  return (
    <>
      {hasPhoto ? (
        <PhotoBottomSheetAttachment animatedPosition={animatedPosition} onRetake={retakePicture} />
      ) : (
        <FlashlightBottomSheetAttachment {...rest} animatedPosition={animatedPosition} />
      )}

      <BottomSheet
        handleComponent={null}
        keyboardBehavior="interactive"
        ref={modalRef}
        enableDynamicSizing
        animatedPosition={animatedPosition}
      >
        <BottomSheetContent className="g-2">
          {hasPhoto ? (
            <>
              <Typography variant="h2">{t('zone.confirmTitle')}</Typography>
              <Button loading={isLoading} onPress={selectPicture}>
                {t('zone.confirm')}
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h2">{t('zone.takePictureTitle')}</Typography>
              <Button loading={isLoading} onPress={takePicture}>
                {t('zone.takePicture')}
              </Button>
            </>
          )}
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
}

export default CameraBottomSheet
