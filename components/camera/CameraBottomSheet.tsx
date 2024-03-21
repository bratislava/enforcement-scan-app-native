import BottomSheet from '@gorhom/bottom-sheet'
import { FlashMode } from 'expo-camera'
import { useRef } from 'react'
import { useSharedValue } from 'react-native-reanimated'

import FlashlightBottomSheetAttachment from '@/components/camera/FlashlightBottomSheetAttachment'
import PhotoBottomSheetAttachment from '@/components/camera/PhotoBottomSheetAttachment'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'

type Props = {
  flashMode: FlashMode
  isLoading: boolean
  hasPhoto: boolean
  takePicture: () => Promise<void>
  retakePicture: () => void
  selectPicture: () => Promise<void>
  toggleFlashlight: () => void
}

const CameraBottomSheet = ({
  hasPhoto,
  flashMode,
  isLoading,
  takePicture,
  selectPicture,
  retakePicture,
  toggleFlashlight,
}: Props) => {
  const modalRef = useRef<BottomSheet>(null)

  const animatedPosition = useSharedValue(0)

  return (
    <>
      {hasPhoto ? (
        <PhotoBottomSheetAttachment animatedPosition={animatedPosition} onRetake={retakePicture} />
      ) : (
        <FlashlightBottomSheetAttachment
          flashMode={flashMode}
          toggleFlashlight={toggleFlashlight}
          animatedPosition={animatedPosition}
        />
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
              <Typography variant="h2">Je fotka okej? :) </Typography>
              <Button loading={isLoading} onPress={selectPicture}>
                Potvrdiť
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h2">Odfoťte zónovú značku</Typography>
              <Button loading={isLoading} onPress={takePicture}>
                Odfotiť
              </Button>
            </>
          )}
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
}

export default CameraBottomSheet
