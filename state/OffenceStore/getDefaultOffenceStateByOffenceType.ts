import { OffenceTypeEnum } from '@/modules/backend/openapi-generated'
import { OFFENCE_TYPE_STEPS } from '@/modules/stepper/offenceTypeSteps'
import { OffenceState } from '@/state/OffenceStore/OffenceStoreProvider'

export const getDefaultOffenceStateByOffenceType = (offenceType: OffenceTypeEnum): OffenceState => {
  const offenceTypeStepsObject = OFFENCE_TYPE_STEPS.find(({ offenceTypes }) =>
    offenceTypes.includes(offenceType),
  )

  if (!offenceTypeStepsObject) throw new Error('Offence type not found')

  return {
    steps: offenceTypeStepsObject.steps,
    ...offenceTypeStepsObject.defaultValues,
  }
}
