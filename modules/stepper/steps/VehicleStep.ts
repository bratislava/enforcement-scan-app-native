import { OffenceStep } from '@/modules/stepper/types'

export type VehicleStep = OffenceStep<'offence/vehicle'>

export const isVehicleStep = (step?: OffenceStep<string>): step is VehicleStep => {
  return !!(step && step.path === 'offence/vehicle')
}
