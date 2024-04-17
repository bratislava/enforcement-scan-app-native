import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { View } from 'react-native'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import IconButton from '@/components/shared/IconButton'
import { useClearHistory } from '@/hooks/useClearHistory'
import { useTranslation } from '@/hooks/useTranslations'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { ScanResultEnum } from '@/modules/backend/openapi-generated'
import { getDefaultOffenceStateByRole } from '@/state/OffenceStore/getDefaultOffenceStateByRole'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

type ScanResultSearchParams = {
  scanResult: ScanResultEnum
}

const OffenceResultPage = () => {
  const t = useTranslation('OffenceResultScreen')
  const { scanResult } = useLocalSearchParams<ScanResultSearchParams>()

  const { resetOffenceState } = useSetOffenceState()
  const { roleKey, zonePhoto, zone, location } = useOffenceStoreContext((state) => state)
  const role = getRoleByKey(roleKey)

  const clearHistory = useClearHistory()
  const navigation = useNavigation()

  const headerRight = () => (
    <IconButton
      name="home"
      accessibilityLabel={t('home')}
      onPress={() => {
        router.replace('/')
        clearHistory()
      }}
    />
  )

  if (!(scanResult && role)) {
    return (
      <ErrorScreen options={{ headerTransparent: true, headerRight }} text={t('resultError')} />
    )
  }

  // Function to reset the navigation stack to a specific route
  const onBackToRoute = (name: string) => {
    const state = navigation.getState()

    const index = state.routes.findIndex((route) => route.name === name)
    navigation.reset({
      ...state,
      index,
      routes: state.routes.slice(0, index + 1),
    })
  }

  const onNewScanPress = () => {
    resetOffenceState({ ...getDefaultOffenceStateByRole(role.key), zone, zonePhoto, location })
    onBackToRoute('scan/licence-plate-camera')
  }

  const onNewZonePress = () => {
    resetOffenceState(getDefaultOffenceStateByRole(role.key))
    onBackToRoute('zone/index')
  }

  return (
    <ScreenViewCentered
      options={{
        headerTransparent: true,
        headerRight,
      }}
      actionButton={
        <View className="g-2">
          <ContinueButton onPress={onNewScanPress}>{t('newScan')}</ContinueButton>

          {role?.actions.zone ? (
            <ContinueButton variant="secondary" onPress={onNewZonePress}>
              {t('newZone')}
            </ContinueButton>
          ) : null}
        </View>
      }
    >
      <ContentWithAvatar variant="success" title={t('title')} text={t('description')} />
    </ScreenViewCentered>
  )
}

export default OffenceResultPage
