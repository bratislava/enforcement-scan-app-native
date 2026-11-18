import { useTranslation } from 'react-i18next'
import { Pressable, useWindowDimensions } from 'react-native'

import Icon from '@/components/shared/Icon'
import Switch from '@/components/shared/Switch'
import Typography from '@/components/shared/Typography'
import colors from '@/tailwind.config.colors'
import { cn } from '@/utils/cn'

// Below this width (in dp, divided by the font scale) the header has no room for the label next to the title,
// so the label is replaced by an icon.
const LABEL_MIN_SCALED_WIDTH = 360

type Props = {
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
}

/**
 * Header switch that marks the next zone sign photo as a passport photo.
 *
 * The label (or icon) and the switch are one tap target and one screen reader element.
 */
const PassportPhotoSwitch = ({ value, onValueChange, disabled }: Props) => {
  const { t } = useTranslation()
  const { width, fontScale } = useWindowDimensions()

  const isLabelVisible = width / fontScale >= LABEL_MIN_SCALED_WIDTH
  const contentClassName = cn(value ? 'text-info' : 'text-dark', disabled && 'opacity-50')

  return (
    <Pressable
      testID="passportPhotoSwitch"
      accessible
      accessibilityRole="switch"
      accessibilityLabel={t('zone.passport.pill')}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      hitSlop={{ top: 8, bottom: 8, left: 8 }}
      className="min-h-[48px] flex-row items-center g-1"
    >
      {isLabelVisible ? (
        <Typography variant="small-semibold" className={contentClassName}>
          {t('zone.passport.label')}
        </Typography>
      ) : (
        <Icon name="verified" size={20} className={contentClassName} />
      )}
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        // the Pressable above is the accessible element
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
        // placeholder grey keeps the off track visible on the white header (3.7:1)
        trackColor={{ false: colors.placeholder, true: colors.info.DEFAULT }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.placeholder}
      />
    </Pressable>
  )
}

export default PassportPhotoSwitch
