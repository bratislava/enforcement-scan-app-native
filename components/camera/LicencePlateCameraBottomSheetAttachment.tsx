import { useTranslation } from 'react-i18next'
import { SharedValue } from 'react-native-reanimated'

import BottomSheetTopAttachment from '@/components/screen-layout/BottomSheet/BottomSheetTopAttachment'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'

type Props = {
  animatedPosition: SharedValue<number>
  licencePlate?: string
  onChangeLicencePlate: (plate: string) => void
}

const LicencePlateCameraBottomSheetAttachment = ({
  animatedPosition,
  licencePlate,
  onChangeLicencePlate,
}: Props) => {
  const { t } = useTranslation()

  return (
    <BottomSheetTopAttachment animatedPosition={animatedPosition}>
      <FlexRow className="flex-1 items-end justify-between p-2.5 pt-0">
        {licencePlate ? (
          <IconButton
            accessibilityLabel={t('scanLicencePlate.retryScan')}
            variant="white-raised"
            name="autorenew"
            onPress={() => onChangeLicencePlate('')}
          />
        ) : undefined}
      </FlexRow>
    </BottomSheetTopAttachment>
  )
}

export default LicencePlateCameraBottomSheetAttachment
