import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import IconButton from '@/components/shared/IconButton'
import { useClearHistory } from '@/hooks/useClearHistory'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { ScanResultEnum } from '@/modules/backend/openapi-generated'
import { getDefaultOffenceStateByRole } from '@/state/OffenceStore/getDefaultOffenceStateByRole'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

type OffenceResultSearchParams = {
  scanResult: ScanResultEnum
}

const OffenceResultPage = () => {
  const { t } = useTranslation()
  const { scanResult } = useLocalSearchParams<OffenceResultSearchParams>()

  const { resetOffenceState } = useSetOffenceState()
  const { roleKey, zonePhoto, zone, location } = useOffenceStoreContext((state) => state)
  const role = getRoleByKey(roleKey)

  const clearHistory = useClearHistory()
  const navigation = useNavigation()

  const headerRight = () => (
    <IconButton
      name="home"
      accessibilityLabel={t('offenceResult.home')}
      onPress={() => {
        router.replace('/')
        clearHistory()
      }}
    />
  )

  // Function to reset the navigation stack to the 'scan/licence-plate-camera' screen when going back (back button or swipe back)
  useEffect(() => {
    if (!(scanResult && role)) return () => {}

    return navigation.addListener('beforeRemove', (e) => {
      // prevents going back
      e.preventDefault()

      if (e.data.action.type === 'GO_BACK') {
        resetOffenceState({ ...getDefaultOffenceStateByRole(role.key), zone, zonePhoto, location })
        router.navigate('scan/licence-plate-camera')
      } else navigation.dispatch(e.data.action)
    })
  }, [location, navigation, resetOffenceState, role, scanResult, zone, zonePhoto])

  if (!(scanResult && role)) {
    return (
      <ErrorScreen
        options={{ headerTransparent: true, headerRight }}
        text={t('offenceResult.resultError')}
      />
    )
  }

  const onNewZonePress = () => {
    resetOffenceState(getDefaultOffenceStateByRole(role.key))
    router.navigate('zone')
  }

  return (
    <ScreenViewCentered
      options={{
        headerTransparent: true,
        headerRight,
      }}
      actionButton={
        <View className="g-2">
          <ContinueButton onPress={router.back}>{t('offenceResult.newScan')}</ContinueButton>

          {role?.actions.zone ? (
            <ContinueButton variant="secondary" onPress={onNewZonePress}>
              {t('offenceResult.newZone')}
            </ContinueButton>
          ) : null}
        </View>
      }
    >
      <ContentWithAvatar
        variant="success"
        title={t('offenceResult.title')}
        text={t('offenceResult.description')}
      />
    </ScreenViewCentered>
  )
}

export default OffenceResultPage
