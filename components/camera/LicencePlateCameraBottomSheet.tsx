import BottomSheet from '@gorhom/bottom-sheet'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
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
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'

type Props = FlashLightProps & {
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
  ...rest
}: Props) => {
  const { t } = useTranslation()
  const modalRef = useRef<BottomSheet>(null)

  const animatedPosition = useSharedValue(0)

  const showCheckLicencePlateWarning = licencePlate?.includes('0') || licencePlate?.includes('O')

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
        handleComponent={BottomSheetHandleWithShadow}
        keyboardBehavior="interactive"
        ref={modalRef}
        onClose={modalRef.current?.expand}
        enableDynamicSizing
        animatedPosition={animatedPosition}
      >
        <BottomSheetContent className="g-2">
          {showCheckLicencePlateWarning ? (
            <Panel className="bg-warning-light">
              <Typography>{t('scanLicencePlate.checkLicencePlateWarning')}</Typography>
            </Panel>
          ) : null}

          <Field label="EČV">
            <TextInput
              accessibilityLabel={t('scanLicencePlate.licencePlate')}
              value={licencePlate}
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
