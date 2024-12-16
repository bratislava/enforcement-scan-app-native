import { OffenceStep } from '@/modules/stepper/types'

export type ZoneStep = OffenceStep<'zone', { residents?: boolean }>

export const isZoneStep = (step?: OffenceStep<string>): step is ZoneStep => {
  return !!(step && step.path === 'zone')
}
