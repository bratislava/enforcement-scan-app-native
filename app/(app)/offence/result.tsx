import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ContinueButton from '@/components/navigation/ContinueButton'
import { HomeButton } from '@/components/navigation/HomeButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { getDefaultOffenceStateByRole } from '@/state/OffenceStore/getDefaultOffenceStateByRole'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

type OffenceResultSearchParams = {
  offenceResult: 'success' | 'error'
}

const OffenceResultPage = () => {
  const { t } = useTranslation()
  const { offenceResult } = useLocalSearchParams<OffenceResultSearchParams>()

  const { resetOffenceState } = useSetOffenceState()
  const { roleKey, zonePhoto, zone, location } = useOffenceStoreContext((state) => state)
  const role = getRoleByKey(roleKey)

  const navigation = useNavigation()

  const showErrorScreen = !offenceResult || offenceResult === 'error' || !role

  // Function to reset the navigation stack to the 'scan/licence-plate-camera' screen when going back (back button or swipe back)
  useEffect(() => {
    if (showErrorScreen) return () => {}

    return navigation.addListener('beforeRemove', (e) => {
      // prevents going back
      e.preventDefault()

      if (e.data.action.type === 'GO_BACK') {
        resetOffenceState({ ...getDefaultOffenceStateByRole(role.key), zone, zonePhoto, location })
        router.navigate('scan/licence-plate-camera')
      } else navigation.dispatch(e.data.action)
    })
  }, [location, navigation, resetOffenceState, zone, zonePhoto, showErrorScreen, role?.key])

  if (showErrorScreen) {
    return (
      <ErrorScreen
        options={{ headerTransparent: true, headerRight: () => <HomeButton /> }}
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
        headerRight: () => <HomeButton />,
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
