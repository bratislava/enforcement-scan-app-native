import { OffenceStep } from '@/modules/stepper/types'

export type OffenceDetailsStep = OffenceStep<
  'offence',
  { canChangeLicencePlate?: boolean; hasToBeInZone?: boolean }
>

export const isOffenceDetailsStep = (step?: OffenceStep<string>): step is OffenceDetailsStep => {
  return !!(step && step.path === 'offence')
}
