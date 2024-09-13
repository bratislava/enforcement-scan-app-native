import BottomSheet from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'
import { useSharedValue } from 'react-native-reanimated'

import FlashlightBottomSheetAttachment from '@/components/camera/FlashlightBottomSheetAttachment'
import Field from '@/components/inputs/Field'
import TextInput from '@/components/inputs/TextInput'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Button from '@/components/shared/Button'
import IconButton from '@/components/shared/IconButton'

type Props = {
  licencePlate?: string
  isLoading: boolean
  onContinue: () => Promise<void>
  onChangeLicencePlate: (plate: string) => void
}

const LicencePlateCameraBottomSheet = ({
  licencePlate,
  isLoading,
  onContinue,
  onChangeLicencePlate,
}: Props) => {
  const { t } = useTranslation()

  const animatedPosition = useSharedValue(0)

  return (
    <>
      <FlashlightBottomSheetAttachment
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
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
}

export default LicencePlateCameraBottomSheet
