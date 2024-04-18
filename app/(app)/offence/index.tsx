import { Link, router } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'

import SelectButton from '@/components/inputs/SelectButton'
import TextInput from '@/components/inputs/TextInput'
import SelectRow from '@/components/list-rows/SelectRow'
import LocationMapPreview from '@/components/map/location-map/LocationMapPreview'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslations'
import { getOffenceTypeLabel } from '@/modules/backend/constants/offenceTypes'
import { getResolutionTypeLabel } from '@/modules/backend/constants/resolutionTypes'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { useLocation } from '@/modules/map/hooks/useLocation'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

// TODO - move to translations JSON after this feature is added
const requiredText = 'Toto pole je povinné'

const OffencePage = () => {
  const t = useTranslation('OffenceScreen')

  const { ecv, offenceType, roleKey, resolutionType, isObjectiveResponsibility, location } =
    useOffenceStoreContext((state) => state)
  const { setOffenceState } = useSetOffenceState()
  const role = getRoleByKey(roleKey)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTouched, setIsTouched] = useState(false)

  const [currentLocation] = useLocation()

  const onSubmit = async () => {
    setIsSubmitting(true)
    setIsTouched(true)

    if (!(offenceType && resolutionType)) {
      setIsSubmitting(false)

      return
    }

    router.push('/offence/vehicle')
    setIsSubmitting(false)
  }

  useEffect(() => {
    if (currentLocation?.coords && !location) {
      setOffenceState({
        location: { lat: currentLocation.coords.latitude, long: currentLocation.coords.longitude },
      })
    }
  }, [currentLocation, location, setOffenceState])

  return (
    <ScreenView
      title={t('title')}
      className="flex-1 justify-start"
      actionButton={
        <ContinueButton loading={isSubmitting} disabled={isSubmitting} onPress={onSubmit} />
      }
    >
      <ScrollView alwaysBounceHorizontal={false}>
        <ScreenContent>
          <Field label={t('vehicle')}>
            <TextInput
              value={ecv}
              isDisabled={!!role?.actions.scanCheck}
              onChangeText={(value) => setOffenceState({ ecv: value })}
            />
          </Field>

          <Field label={t('location')}>
            <PressableStyled
              onPress={() => {
                router.push('/offence/location')
              }}
            >
              <LocationMapPreview />
            </PressableStyled>
          </Field>

          <Field
            label={t('offenceType')}
            errorMessage={isTouched && !offenceType ? requiredText : undefined}
          >
            <Link asChild href="/offence/offence-type">
              <SelectButton
                hasError={isTouched && !offenceType}
                value={offenceType ? getOffenceTypeLabel(offenceType) : undefined}
                placeholder={t('offenceTypePlaceholder')}
              />
            </Link>
          </Field>

          <Field
            label={t('offenceResolution')}
            errorMessage={isTouched && !resolutionType ? requiredText : undefined}
          >
            <Link asChild href="/offence/resolution-type">
              <SelectButton
                hasError={isTouched && !resolutionType}
                value={resolutionType ? getResolutionTypeLabel(resolutionType) : undefined}
                placeholder={t('offenceResolutionPlaceholder')}
              />
            </Link>
          </Field>

          <SelectRow
            disabled={!role?.actions.subjective}
            label={t('objectiveResponsibility')}
            onValueChange={() =>
              setOffenceState({ isObjectiveResponsibility: !isObjectiveResponsibility })
            }
            value={isObjectiveResponsibility}
          />
        </ScreenContent>
      </ScrollView>
    </ScreenView>
  )
}

export default OffencePage
