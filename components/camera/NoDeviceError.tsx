import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'

export const NoDeviceError = () => {
  const { t } = useTranslation()

  return (
    <View className="h-full items-center bg-white pt-10">
      <ContentWithAvatar variant="error" title={t('camera.ocr.error.title')} />
    </View>
  )
}
