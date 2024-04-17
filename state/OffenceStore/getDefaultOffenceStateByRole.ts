import { RoleKeyType } from '@/modules/backend/constants/roles'
import { defaultOffenceState, defaultValuesForRoles } from '@/state/OffenceStore/constants'
import { OffenceState } from '@/state/OffenceStore/OffenceStoreProvider'

export const getDefaultOffenceStateByRole = (roleKey: RoleKeyType): OffenceState => {
  return {
    roleKey,
    ...defaultOffenceState,
    ...defaultValuesForRoles[roleKey],
  }
}
