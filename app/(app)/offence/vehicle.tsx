import { isAxiosError } from 'axios'
import { Redirect, router, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { MAX_PHOTOS } from '@/app/(app)/offence/photos'
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

const ALLOWED_VEHICLE_ERRORS = new Set([400, 404, 422, 424])

const Page = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const { ecv, vehicleId, photos } = useOffenceStoreContext((state) => state)
  const { setOffenceState } = useSetOffenceState()

  const { data, isPending, isError, error } = useQueryWithFocusRefetch(
    getVehiclePropertiesOptions(ecv),
  )

  useEffect(() => {
    if (data?.items.length === 1) {
      setOffenceState({ vehicleId: data.items[0].vehicleId })
    }
  }, [data, setOffenceState])

  const redirectPath = photos.length < MAX_PHOTOS ? '/offence/photos' : '/offence/photos/library'

  useEffect(() => {
    return navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()

      if (e.data.action.type === 'GO_BACK' && vehicleId) {
        setOffenceState({ vehicleId: undefined })
      }
      navigation.dispatch(e.data.action)
    })
  }, [navigation, setOffenceState, vehicleId])

  if (isPending) {
    return <LoadingScreen title={t('vehicleDetail.title')} asScreenView />
  }

  if (
    isError &&
    isAxiosError(error) &&
    error.response?.status &&
    !ALLOWED_VEHICLE_ERRORS.has(error.response.status)
  ) {
    return (
      <ErrorScreen
        text={error?.message}
        actionButton={<ContinueButton onPress={() => router.push(redirectPath)} />}
      />
    )
  }

  if (!data || data?.items.length === 0) {
    return (
      <ScreenView title={t('vehicleDetail.title')}>
        <Redirect href={redirectPath} />
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

          <ContinueButton onPress={() => router.push(redirectPath)} />
        </ScreenContent>
      </ScrollView>
    </ScreenView>
  )
}

export default Page
