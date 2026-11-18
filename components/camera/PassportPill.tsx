import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Icon from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

/**
 * Small badge that marks a zone sign photo as a passport photo.
 */
const PassportPill = () => {
  const { t } = useTranslation()

  return (
    <View
      testID="passportPill"
      className="flex-row items-center self-start rounded-full bg-info-light py-1 pl-2 pr-3 g-1"
    >
      <Icon name="verified" size={16} className="text-info" />
      <Typography variant="small-semibold" className="text-info">
        {t('zone.passport.pill')}
      </Typography>
    </View>
  )
}

export default PassportPill
