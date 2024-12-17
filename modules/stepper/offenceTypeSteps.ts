import { OffenceTypeEnum, ScanReasonEnum } from '@/modules/backend/openapi-generated'
import { AvailableSteps } from '@/modules/stepper/types'
import { OffenceState } from '@/state/OffenceStore/OffenceStoreProvider'

type OffenceTypeStep = {
  offenceTypes: OffenceTypeEnum[]
  steps: AvailableSteps[]
  defaultValues: OffenceState
}

export const OFFENCE_TYPE_STEPS: OffenceTypeStep[] = [
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
        options: { canChangeLicencePlate: false, hasToBeInZone: true },
      },
      {
        path: 'offence/vehicle',
      },
      {
        path: 'offence/photos',
        options: { numberOfPhotos: 6 },
      },
    ],
    defaultValues: {
      isObjectiveResponsibility: true,
      photos: [],
    },
  },
  {
    offenceTypes: [OffenceTypeEnum.Dz],
    steps: [
      {
        path: 'zone',
      },
      {
        path: 'scan',
        options: { scanCheck: false, scanReason: ScanReasonEnum.PaasParkingAuthorization },
      },
      {
        path: 'offence',
        options: { canChangeLicencePlate: true, hasToBeInZone: false },
      },
      {
        path: 'offence/vehicle',
      },
      {
        path: 'offence/photos',
        options: { numberOfPhotos: 6 },
      },
    ],
    defaultValues: {
      isObjectiveResponsibility: true,
      photos: [],
    },
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
        options: { canChangeLicencePlate: true, hasToBeInZone: false },
      },
      {
        path: 'offence/vehicle',
      },
      {
        path: 'offence/photos',
        options: { numberOfPhotos: 6 },
      },
    ],
    defaultValues: {
      isObjectiveResponsibility: true,
      photos: [],
    },
  },
]

// Function to ensure all offenceTypes are included and unique
function validateOffenceTypes(steps: OffenceTypeStep[]): boolean {
  const allOffenceTypes = steps.flatMap((step) => step.offenceTypes)
  const uniqueOffenceTypes = new Set(allOffenceTypes)

  return uniqueOffenceTypes.size === allOffenceTypes.length
}

if (!validateOffenceTypes(OFFENCE_TYPE_STEPS)) {
  throw new Error('Duplicate offenceTypes found or some offenceTypes are missing')
}
