import { RoleKeyType } from '@/modules/backend/constants/roles'
import { OffenceTypeEnum, ResolutionOffenceTypeEnum } from '@/modules/backend/openapi-generated'
import { OffenceState } from '@/state/OffenceStore/OffenceStoreProvider'

export const defaultOffenceState: OffenceState = {
  isObjectiveResponsibility: true,
  photos: [],
}

// TODO: Add default values for other roles when needed
export const defaultValuesForRoles: { [key in RoleKeyType]: Partial<OffenceState> } = {
  paas: {
    offenceType: OffenceTypeEnum.O,
    resolutionType: ResolutionOffenceTypeEnum.JustRegistration,
  },
  'municipal-police': {},
  petrzalka: {},
  research: {},
}
