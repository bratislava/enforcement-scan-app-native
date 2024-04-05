import { Link, router } from 'expo-router'
import { useState } from 'react'

import SelectButton from '@/components/inputs/SelectButton'
import TextInput from '@/components/inputs/TextInput'
import SelectRow from '@/components/list-rows/SelectRow'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Field from '@/components/shared/Field'
import { getOffenceTypeLabel } from '@/modules/backend/constants/offenceTypes'
import { getResolutionTypeLabel } from '@/modules/backend/constants/resolutionTypes'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

// TODO - move to translations JSON after this feature is added
const requiredText = 'Toto pole je povinné'

const OffencePage = () => {
  const { ecv, offenceType, resolutionType, isObjectiveResponsibility } = useOffenceStoreContext(
    (state) => state,
  )
  const setState = useSetOffenceState()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTouched, setIsTouched] = useState(false)

  const onSubmit = async () => {
    setIsSubmitting(true)
    setIsTouched(true)

    if (!(offenceType && resolutionType)) {
      setIsSubmitting(false)

      return
    }

    router.push('/offence/confirm')
    setIsSubmitting(false)
  }

  return (
    <ScreenView title="Hlásenie priestupku" className="flex-1 justify-start">
      <ScreenContent>
        <Field label="Vozidlo">
          <TextInput value={ecv} isDisabled />
        </Field>

        <Field
          label="Druh priestupku"
          errorMessage={isTouched && !offenceType ? requiredText : undefined}
        >
          <Link asChild href="/offence/offence-type">
            <SelectButton
              hasError={isTouched && !offenceType}
              value={offenceType ? getOffenceTypeLabel(offenceType) : undefined}
              placeholder="Vyberte druh priestupku"
            />
          </Link>
        </Field>

        <Field
          label="Vyriešenie priestupku"
          errorMessage={isTouched && !resolutionType ? requiredText : undefined}
        >
          <Link asChild href="/offence/resolution-type">
            <SelectButton
              hasError={isTouched && !resolutionType}
              value={resolutionType ? getResolutionTypeLabel(resolutionType) : undefined}
              placeholder="Vyberte druh vyriešenia"
            />
          </Link>
        </Field>

        <SelectRow
          label="Objektívna zodpovednosť"
          onValueChange={() => setState({ isObjectiveResponsibility: !isObjectiveResponsibility })}
          value={!!isObjectiveResponsibility}
        />

        <ContinueButton loading={isSubmitting} disabled={isSubmitting} onPress={onSubmit} />
      </ScreenContent>
    </ScreenView>
  )
}

export default OffencePage
