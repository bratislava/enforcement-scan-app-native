import { IconName } from '@/components/shared/Icon'
import { t } from '@/i18n.config'
import { OFFENCE_TYPES } from '@/modules/backend/constants/offenceTypes'
import {
  OffenceTypeEnum,
  ResolutionOffenceTypeEnum,
  ScanReasonEnum,
} from '@/modules/backend/openapi-generated'

export type RoleKeyType = 'paas' | 'municipal-police'
export type ActionKeyType = 'zone' | 'offence' | 'scanCheck' | 'subjective'

export type RoleItem = {
  icon: IconName
  key: RoleKeyType
  title: string
  description: string
  scanReason: ScanReasonEnum
  resolutionTypes?: ResolutionOffenceTypeEnum[]
  offenceTypes?: OffenceTypeEnum[]
  actions: { [key in ActionKeyType]?: boolean }
}

export const ROLE_OFFENCE_TYPES: { [key in RoleKeyType]: OffenceTypeEnum[] } = {
  paas: [OffenceTypeEnum.O, OffenceTypeEnum.NB, OffenceTypeEnum.Dz],
  'municipal-police': OFFENCE_TYPES.map((type) => type.value),
}

export const ROLES: RoleItem[] = [
  {
    key: 'paas',
    icon: 'map',
    title: t('roles.paas.title'),
    description: t('roles.paas.description'),
    actions: {
      zone: true,
      offence: true,
      scanCheck: true,
    },
    resolutionTypes: [ResolutionOffenceTypeEnum.JustRegistration],
    offenceTypes: [OffenceTypeEnum.O, OffenceTypeEnum.NB, OffenceTypeEnum.Dz],
    scanReason: ScanReasonEnum.PaasParkingAuthorization,
  },
  {
    key: 'municipal-police',
    icon: 'camera',
    title: t('roles.police.title'),
    description: t('roles.police.description'),
    actions: {
      subjective: true,
      offence: true,
    },
    scanReason: ScanReasonEnum.Other,
  },
]

export const getRoleByKey = (key?: string) => ROLES.find((role) => role.key === key)
