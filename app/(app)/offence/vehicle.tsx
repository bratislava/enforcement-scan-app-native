import { isAxiosError } from 'axios'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
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

// TODO - move to translations JSON after this feature is added
const requiredText = 'Toto pole je povinné'

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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTouched, setIsTouched] = useState(false)

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

  const onSubmit = async () => {
    router.push('/offence/photos')
    setIsSubmitting(true)
    setIsTouched(true)

    if (data?.items.length ? !(vehicleBrand && vehicleColor && vehicleType) : !vehicleId) {
      setIsSubmitting(false)

      return
    }

    setIsSubmitting(false)
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
                <Field
                  key={key}
                  label={label}
                  errorMessage={isTouched && !vehicleDataMap[key] ? requiredText : undefined}
                >
                  <TextInput
                    hasError={isTouched && !vehicleDataMap[key]}
                    value={vehicleDataMap[key]}
                    onChangeText={(value) => setOffenceState({ [key]: value })}
                  />
                </Field>
              ))}

          <ContinueButton
            loading={isSubmitting}
            disabled={isSubmitting || (!!data?.items.length && !vehicleId)}
            onPress={onSubmit}
          />
        </ScreenContent>
      </ScrollView>
    </ScreenView>
  )
}

export default Page
