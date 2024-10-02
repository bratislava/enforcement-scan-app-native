import * as Application from 'expo-application'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Typography from '@/components/shared/Typography'
import { environment } from '@/environment'

export const APP_VERSION = `${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`

const AppVersion = () => {
  const { t } = useTranslation()

  return (
    <View>
      <Typography className="text-center">
        {environment.deployment === 'production' ? '' : 'DEV'}
        {t('appVersion', {
          version: APP_VERSION,
        })}
      </Typography>
    </View>
  )
}

export default AppVersion
