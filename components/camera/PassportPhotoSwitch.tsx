import { useTranslation } from 'react-i18next'
import { useWindowDimensions, View } from 'react-native'

import Switch from '@/components/shared/Switch'
import Typography from '@/components/shared/Typography'
import colors from '@/tailwind.config.colors'
import { cn } from '@/utils/cn'

// Below this width (in dp, divided by the font scale) the header has no room for the label next to the title,
// so only the switch is shown.
const LABEL_MIN_SCALED_WIDTH = 360

type Props = {
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
}

/**
 * Header switch that marks the next zone sign photo as a passport photo.
 */
const PassportPhotoSwitch = ({ value, onValueChange, disabled }: Props) => {
  const { t } = useTranslation()
  const { width, fontScale } = useWindowDimensions()

  const isLabelVisible = width / fontScale >= LABEL_MIN_SCALED_WIDTH

  return (
    <View className="flex-row items-center g-1">
      {isLabelVisible ? (
        <Typography
          variant="small-semibold"
          className={cn(value ? 'text-info' : 'text-dark', disabled && 'opacity-50')}
        >
          {t('zone.passport.label')}
        </Typography>
      ) : null}
      <Switch
        testID="passportPhotoSwitch"
        accessibilityLabel={t('zone.passport.pill')}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.divider, true: colors.info.DEFAULT }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.divider}
      />
    </View>
  )
}

export default PassportPhotoSwitch
