import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect } from 'react'
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

type OffenceResultSearchParams = {
  scanResult: ScanResultEnum
}

const OffenceResultPage = () => {
  const t = useTranslation('OffenceResultScreen')
  const { scanResult } = useLocalSearchParams<OffenceResultSearchParams>()

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

  // Function to reset the navigation stack to the 'scan/licence-plate-camera' screen when going back (back button or swipe back)
  useEffect(() => {
    if (!(scanResult && role)) return () => {}

    return navigation.addListener('beforeRemove', (e) => {
      // prevents going back
      e.preventDefault()

      const state = navigation.getState()

      const index = state.routes.findIndex((route) => route.name === 'scan/licence-plate-camera')
      const currentRoute = state.routes[state.index]

      // resets navigation to remove all the routes between the 'scan/licence-plate-camera' screen and the current screen
      navigation.reset({
        ...state,
        index: index + 1,
        routes: [...state.routes.slice(0, index + 1), currentRoute],
      })
      resetOffenceState({ ...getDefaultOffenceStateByRole(role.key), zone, zonePhoto, location })

      // finally goes back
      navigation.dispatch(e.data.action)
    })
  }, [location, navigation, resetOffenceState, role, scanResult, zone, zonePhoto])

  if (!(scanResult && role)) {
    return (
      <ErrorScreen options={{ headerTransparent: true, headerRight }} text={t('resultError')} />
    )
  }

  const onNewZonePress = () => {
    resetOffenceState(getDefaultOffenceStateByRole(role.key))

    const state = navigation.getState()
    const index = state.routes.findIndex((route) => route.name === 'zone/index')
    navigation.reset({
      ...state,
      index,
      routes: state.routes.slice(0, index + 1),
    })
  }

  return (
    <ScreenViewCentered
      options={{
        headerTransparent: true,
        headerRight,
      }}
      actionButton={
        <View className="g-2">
          <ContinueButton onPress={router.back}>{t('newScan')}</ContinueButton>

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
