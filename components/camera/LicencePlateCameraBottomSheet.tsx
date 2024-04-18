import BottomSheet from '@gorhom/bottom-sheet'
import { useRef } from 'react'
import { useSharedValue } from 'react-native-reanimated'

import FlashlightBottomSheetAttachment, {
  FlashLightProps,
} from '@/components/camera/FlashlightBottomSheetAttachment'
import TextInput from '@/components/inputs/TextInput'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import Button from '@/components/shared/Button'
import Field from '@/components/shared/Field'
import IconButton from '@/components/shared/IconButton'
import { useTranslation } from '@/hooks/useTranslations'

type Props = FlashLightProps & {
  licencePlate?: string
  isLoading: boolean
  takePicture: () => Promise<void>
  onChangeLicencePlate: (plate: string) => void
}

const LicencePlateCameraBottomSheet = ({
  licencePlate,
  isLoading,
  takePicture,
  onChangeLicencePlate,
  ...rest
}: Props) => {
  const t = useTranslation('LicencePlateCameraScreen')
  const modalRef = useRef<BottomSheet>(null)

  const animatedPosition = useSharedValue(0)

  return (
    <>
      <FlashlightBottomSheetAttachment
        {...rest}
        animatedPosition={animatedPosition}
        iconLeft={
          licencePlate ? (
            <IconButton
              accessibilityLabel={t('retryScan')}
              variant="white-raised"
              name="autorenew"
              onPress={() => onChangeLicencePlate('')}
            />
          ) : undefined
        }
      />

      <BottomSheet
        handleComponent={BottomSheetHandleWithShadow}
        keyboardBehavior="interactive"
        ref={modalRef}
        enableDynamicSizing
        animatedPosition={animatedPosition}
      >
        <BottomSheetContent className="g-2">
          <Field label="EČV">
            <TextInput
              isInsideBottomSheet
              accessibilityLabel={t('licencePlate')}
              value={licencePlate}
              onChangeText={onChangeLicencePlate}
            />
          </Field>

          <Button loading={isLoading} onPress={takePicture}>
            {licencePlate ? t('next') : t('scan')}
          </Button>
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
}

export default LicencePlateCameraBottomSheet
