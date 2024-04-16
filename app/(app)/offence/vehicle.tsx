import { isAxiosError } from 'axios'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { ScrollView } from 'react-native'

import Field from '@/components/inputs/Field'
import TextInput from '@/components/inputs/TextInput'
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

const vehicleFields = [
  {
    label: 'Značka',
    key: 'vehicleBrand',
  },
  {
    label: 'Typ',
    key: 'vehicleType',
  },
  {
    label: 'Farba',
    key: 'vehicleColor',
  },
] as const

const Page = () => {
  const { ecv, vehicleColor, vehicleBrand, vehicleType, vehicleId } = useOffenceStoreContext(
    (state) => state,
  )
  const { setOffenceState } = useSetOffenceState()

  const { data, isPending, isError, error } = useQueryWithFocusRefetch(
    getVehiclePropertiesOptions(ecv),
  )

  useEffect(() => {
    if (data?.items.length === 1 && !vehicleId) {
      setOffenceState({ vehicleId: data.items[0].vehicleId })
    }
  }, [data, setOffenceState, vehicleId])

  if (isPending) {
    return <LoadingScreen title="Detail vozidla" asScreenView />
  }

  if (isError && isAxiosError(error) && error.response?.status !== 404) {
    return <ErrorScreen text={error?.message} />
  }

  const vehicleDataMap = {
    vehicleColor,
    vehicleBrand,
    vehicleType,
  }

  return (
    <ScreenView title="Detail vozidla" className="flex-1 justify-start">
      <ScrollView alwaysBounceHorizontal={false}>
        <ScreenContent>
          {data?.items.length
            ? data.items.map((vehicle) => (
                <VehicleTile
                  key={vehicle.vehicleId}
                  {...vehicle}
                  isSelected={vehicle.vehicleId === vehicleId}
                  onPress={() => {
                    setOffenceState({ vehicleId: vehicle.vehicleId })
                  }}
                />
              ))
            : vehicleFields.map(({ key, label }) => (
                <Field key={key} label={label}>
                  <TextInput
                    value={vehicleDataMap[key]}
                    onChangeText={(value) => setOffenceState({ [key]: value })}
                  />
                </Field>
              ))}

          <ContinueButton onPress={() => router.push('/offence/photos')} />
        </ScreenContent>
      </ScrollView>
    </ScreenView>
  )
}

export default Page
