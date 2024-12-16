import { ScanReasonEnum } from '@/modules/backend/openapi-generated'
import { OffenceStep } from '@/modules/stepper/types'

export type LicencePlateStep = OffenceStep<
  'scan',
  { scanCheck?: boolean; scanReason?: ScanReasonEnum }
>

export const isLicencePlateStep = (step?: OffenceStep<string>): step is LicencePlateStep => {
  return !!(step && step.path === 'scan')
}
