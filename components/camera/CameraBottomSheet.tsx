import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { FlashMode } from 'expo-camera'
import { useRef } from 'react'
import { useSharedValue } from 'react-native-reanimated'

import CameraBottomSheetAttachment from '@/components/camera/CameraBottomSheetAttachment'
import TextInput from '@/components/inputs/TextInput'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import Button from '@/components/shared/Button'
import Field from '@/components/shared/Field'

type Props = {
  licencePlate?: string
  flashMode: FlashMode
  takePicture: () => Promise<void>
  toggleFlashlight: () => void
  onChangeLicencePlate: (plate: string) => void
}

const CameraBottomSheet = ({
  licencePlate,
  flashMode,
  takePicture,
  toggleFlashlight,
  onChangeLicencePlate,
}: Props) => {
  const modalRef = useRef<BottomSheet>(null)

  const animatedPosition = useSharedValue(0)

  return (
    <>
      <CameraBottomSheetAttachment
        flashMode={flashMode}
        toggleFlashlight={toggleFlashlight}
        animatedPosition={animatedPosition}
      />

      <BottomSheet
        handleComponent={BottomSheetHandleWithShadow}
        keyboardBehavior="interactive"
        ref={modalRef}
        enableDynamicSizing
        animatedPosition={animatedPosition}
      >
        <BottomSheetContent cn="g-2">
          <Field label="EČV">
            <TextInput
              inputElement={BottomSheetTextInput}
              accessibilityLabel="Evidenčné číslo vozidla"
              value={licencePlate}
              onChangeText={onChangeLicencePlate}
            />
          </Field>

          <Button onPress={takePicture}>Skenovať</Button>
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
}

export default CameraBottomSheet
