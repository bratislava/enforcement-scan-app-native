import * as Application from 'expo-application'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Typography from '@/components/shared/Typography'

export const APP_VERSION = `${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`

const AppVersion = () => {
  const { t } = useTranslation()

  return (
    <View>
      <Typography className="text-center">
        {t('appVersion', {
          version: APP_VERSION,
        })}
      </Typography>
    </View>
  )
}

export default AppVersion
