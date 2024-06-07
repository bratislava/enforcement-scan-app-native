import * as Application from 'expo-application'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Typography from '@/components/shared/Typography'

const AppVersion = () => {
  const { t } = useTranslation()

  return (
    <View>
      <Typography className="text-center">
        {t('appVersion', {
          version: `${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`,
        })}
      </Typography>
    </View>
  )
}

export default AppVersion
