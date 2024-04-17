import { isAxiosError } from 'axios'
import { Redirect, router } from 'expo-router'
import { useEffect } from 'react'
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

const Page = () => {
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

  if (isPending) {
    return <LoadingScreen title="Detail vozidla" asScreenView />
  }

  if (isError && isAxiosError(error) && error.response?.status !== 404) {
    return <ErrorScreen text={error?.message} />
  }

  if (!data || data?.items.length === 0) {
    return (
      <ScreenView title="Detail vozidla">
        <Redirect href="/offence/photos/library" />
      </ScreenView>
    )
  }

  return (
    <ScreenView title="Detail vozidla" className="flex-1 justify-start">
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
