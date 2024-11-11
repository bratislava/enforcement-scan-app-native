import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'

import IconButton from '@/components/shared/IconButton'

export const HomeButton = () => {
  const { t } = useTranslation()

  return (
    <IconButton
      name="home"
      testID="home-button"
      accessibilityLabel={t('offenceResult.home')}
      onPress={() => router.navigate('/')}
    />
  )
}
