import { RoleKeyType } from '@/modules/backend/constants/roles'
import { ResolutionOffenceTypeEnum } from '@/modules/backend/openapi-generated'
import { OffenceState } from '@/state/OffenceStore/OffenceStoreProvider'

export const defaultOffenceState: OffenceState = {
  isObjectiveResponsibility: true,
  photos: [],
}

// TODO: Add default values for other roles when needed
export const defaultValuesForRoles: { [key in RoleKeyType]: Partial<OffenceState> } = {
  // offenceType is intentionally not preset - offence codes change over time (e.g. O -> NX) and a stale
  // default would be submitted without the controller noticing, so it must always be picked explicitly
  paas: {
    resolutionType: ResolutionOffenceTypeEnum.JustRegistration,
  },
  'municipal-police': {},
  research: {},
}
