import { IconName } from '@/components/shared/Icon'
import { t } from '@/i18n.config'
import { OFFENCE_TYPES } from '@/modules/backend/constants/offenceTypes'
import { OffenceTypeEnum } from '@/modules/backend/openapi-generated'

export type RoleKeyType = 'paas' | 'municipal-police'
export type ActionKeyType = 'zone' | 'offence' | 'scanCheck' | 'subjective'

export type RoleItem = {
  icon: IconName
  key: RoleKeyType
  title: string
  offenceTypes: OffenceTypeEnum[]
}

export const ROLES: RoleItem[] = [
  {
    key: 'paas',
    icon: 'map',
    title: t('roles.paas.title'),
    offenceTypes: [OffenceTypeEnum.O, OffenceTypeEnum.NB, OffenceTypeEnum.Dz],
  },
  {
    key: 'municipal-police',
    icon: 'camera',
    title: t('roles.police.title'),
    offenceTypes: OFFENCE_TYPES.map((type) => type.value),
  },
]

export const getRoleByKey = (key?: string) => ROLES.find((role) => role.key === key)
