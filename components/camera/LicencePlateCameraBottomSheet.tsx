import BottomSheet from '@gorhom/bottom-sheet'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSharedValue } from 'react-native-reanimated'

import { accuracyArray } from '@/app/(app)/zone'
import FlashlightBottomSheetAttachment, {
  FlashLightProps,
} from '@/components/camera/FlashlightBottomSheetAttachment'
import TextInput from '@/components/inputs/TextInput'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Button from '@/components/shared/Button'
import Field from '@/components/shared/Field'
import IconButton from '@/components/shared/IconButton'

type Props = FlashLightProps & {
  licencePlate?: string
  isLoading: boolean
  onContinue: () => Promise<void>
  onChangeLicencePlate: (plate: string) => void
  accuracy: (typeof accuracyArray)[number]
  setAccuracy: (accuracy: (typeof accuracyArray)[number]) => void
}

const LicencePlateCameraBottomSheet = ({
  licencePlate,
  isLoading,
  accuracy,
  setAccuracy,
  onContinue,
  onChangeLicencePlate,
  ...rest
}: Props) => {
  const { t } = useTranslation()
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
              accessibilityLabel={t('scanLicencePlate.retryScan')}
              variant="white-raised"
              name="autorenew"
              onPress={() => onChangeLicencePlate('')}
            />
          ) : undefined
        }
      />

      <BottomSheet
        handleComponent={null}
        keyboardBehavior="interactive"
        ref={modalRef}
        onClose={modalRef.current?.expand}
        enableDynamicSizing
        animatedPosition={animatedPosition}
      >
        <BottomSheetContent className="g-2">
          <Field label="EČV">
            <TextInput
              className="h-auto text-center font-source-500medium text-[62px]"
              accessibilityLabel={t('scanLicencePlate.licencePlate')}
              value={licencePlate}
              autoCapitalize="characters"
              onChangeText={onChangeLicencePlate}
            />
          </Field>

          <Button loading={isLoading} disabled={!licencePlate} onPress={onContinue}>
            {t('scanLicencePlate.next')}
          </Button>
          <Button
            onPress={() => {
              // set next accuracy
              const currentIndex = accuracyArray.findIndex((acc) => acc.value === accuracy.value)
              const nextIndex = (currentIndex + 1) % accuracyArray.length
              setAccuracy(accuracyArray[nextIndex])
            }}
          >
            {accuracy.name}
          </Button>
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
}

export default LicencePlateCameraBottomSheet
