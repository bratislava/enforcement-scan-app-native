import { isAxiosError } from 'axios'
import { Redirect, router, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import ContinueButton from '@/components/navigation/ContinueButton'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import VehicleTile from '@/components/tiles/VehicleTile'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { getVehiclePropertiesOptions } from '@/modules/backend/constants/queryParams'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const ALLOWED_VEHICLE_ERRORS = new Set([404, 424])

const Page = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const { ecv, vehicleId } = useOffenceStoreContext((state) => state)
  const { setOffenceState } = useSetOffenceState()

  const { data, isPending, isError, error } = useQueryWithFocusRefetch(
    getVehiclePropertiesOptions(ecv),
  )

  useEffect(() => {
    if (data?.items.length === 1) {
      setOffenceState({ vehicleId: data.items[0].vehicleId })
    }
  }, [data, setOffenceState])

  useEffect(() => {
    return navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()

      if (e.data.action.type === 'GO_BACK') {
        setOffenceState({ vehicleId: undefined })
      }
      navigation.dispatch(e.data.action)
    })
  }, [navigation, setOffenceState])

  if (isPending) {
    return <LoadingScreen title={t('vehicleDetail.title')} asScreenView />
  }

  if (
    isError &&
    isAxiosError(error) &&
    error.response?.status &&
    !ALLOWED_VEHICLE_ERRORS.has(error.response.status)
  ) {
    return <ErrorScreen text={error?.message} />
  }

  if (!data || data?.items.length === 0) {
    return (
      <ScreenView title={t('vehicleDetail.title')}>
        <Redirect href="/offence/photos" />
      </ScreenView>
    )
  }

  return (
    <ScreenView title={t('vehicleDetail.title')} className="flex-1 justify-start">
      <ScrollView alwaysBounceHorizontal={false}>
        <ScreenContent>
          {data.items.map((vehicle) => (
            <VehicleTile
              key={vehicle.vehicleId}
              {...vehicle}
              isSelected={vehicle.vehicleId === vehicleId}
              onPress={() => {
                setOffenceState({ vehicleId: vehicle.vehicleId })
              }}
            />
          ))}

          <ContinueButton onPress={() => router.push('/offence/photos')} />
        </ScreenContent>
      </ScrollView>
    </ScreenView>
  )
}

export default Page
