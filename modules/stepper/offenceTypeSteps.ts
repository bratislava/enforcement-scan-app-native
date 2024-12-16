import { OffenceTypeEnum, ScanReasonEnum } from '@/modules/backend/openapi-generated'
import { AvailableSteps } from '@/modules/stepper/types'

type OffenceTypeStep = { offenceTypes: OffenceTypeEnum[]; steps: AvailableSteps[] }

export const offenceTypeSteps: OffenceTypeStep[] = [
  {
    offenceTypes: [OffenceTypeEnum.N, OffenceTypeEnum.NB],
    steps: [
      {
        path: 'zone',
        options: { residents: true },
      },
      {
        path: 'scan',
        options: { scanCheck: true, scanReason: ScanReasonEnum.PaasParkingAuthorization },
      },
      {
        path: 'offence',
        options: { isLocationRequired: true },
      },
      {
        path: 'offence/vehicle',
      },
      {
        path: 'offence/photos',
        options: { numberOfPhotos: 6 },
      },
    ],
  },
  {
    offenceTypes: [OffenceTypeEnum.Dz],
    steps: [
      {
        path: 'zone',
        options: { residents: true },
      },
      {
        path: 'scan',
        options: { scanCheck: true, scanReason: ScanReasonEnum.PaasParkingAuthorization },
      },
      {
        path: 'offence',
        options: { isLocationRequired: false },
      },
      {
        path: 'offence/vehicle',
      },
      {
        path: 'offence/photos',
        options: { numberOfPhotos: 6 },
      },
    ],
  },
  {
    offenceTypes: [
      OffenceTypeEnum.A,
      OffenceTypeEnum.B,
      OffenceTypeEnum.C,
      OffenceTypeEnum.D,
      OffenceTypeEnum.E,
      OffenceTypeEnum.F,
      OffenceTypeEnum.G,
      OffenceTypeEnum.H,
      OffenceTypeEnum.I,
      OffenceTypeEnum.J,
      OffenceTypeEnum.K,
      OffenceTypeEnum.L,
      OffenceTypeEnum.M,
      OffenceTypeEnum.O,
      OffenceTypeEnum.P,
      OffenceTypeEnum.Q,
      OffenceTypeEnum.R,
      OffenceTypeEnum.S,
      OffenceTypeEnum.T,
      OffenceTypeEnum.U,
    ],
    steps: [
      {
        path: 'scan',
        options: { scanCheck: false, scanReason: ScanReasonEnum.PaasParkingAuthorization },
      },
      {
        path: 'offence',
      },
      {
        path: 'offence/vehicle',
      },
      {
        path: 'offence/photos',
        options: { numberOfPhotos: 6 },
      },
    ],
  },
]

// Function to ensure all offenceTypes are included and unique
function validateOffenceTypes(steps: OffenceTypeStep[]): boolean {
  const allOffenceTypes = steps.flatMap((step) => step.offenceTypes)
  const uniqueOffenceTypes = new Set(allOffenceTypes)

  return uniqueOffenceTypes.size === allOffenceTypes.length
}

if (!validateOffenceTypes(offenceTypeSteps)) {
  throw new Error('Duplicate offenceTypes found or some offenceTypes are missing')
}
