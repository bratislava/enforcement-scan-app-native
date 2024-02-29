import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet'
import { FlashMode } from 'expo-camera'
import { useMemo, useRef } from 'react'
import { View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import CameraBottomSheetAttachment from '@/components/camera/CameraBottomSheetAttachment'
import TextInput from '@/components/inputs/TextInput'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import Button from '@/components/shared/Button'
import Field from '@/components/shared/Field'
import { clsx } from '@/utils/clsx'

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

  const snapPoints = useMemo(() => ['30%', '50%'], [])

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
        index={1}
        snapPoints={snapPoints}
        keyboardBehavior="interactive"
        ref={modalRef}
        animatedPosition={animatedPosition}
      >
        <BottomSheetContent cn={clsx('bg-white g-2')}>
          <BottomSheetView>
            <Field label="EČV">
              <TextInput
                inputElement={BottomSheetTextInput}
                accessibilityLabel="Evidenčné číslo vozidla"
                value={licencePlate}
                onChangeText={onChangeLicencePlate}
              />
            </Field>

            <View className="flex-col items-center">
              <Button onPress={takePicture}>Skenovať</Button>
            </View>
          </BottomSheetView>
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
}

export default CameraBottomSheet
