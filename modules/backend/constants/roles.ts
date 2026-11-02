import { IconName } from '@/components/shared/Icon'
import { t } from '@/i18n.config'
import { ResolutionOffenceTypeEnum, ScanReasonEnum } from '@/modules/backend/openapi-generated'

export const RoleKey = {
  Paas: 'paas',
  MunicipalPolice: 'municipal-police',
  Research: 'research',
} as const

export type RoleKeyType = (typeof RoleKey)[keyof typeof RoleKey]
export type ActionKeyType = 'zone' | 'offence' | 'scanCheck' | 'subjective'

export type RoleItem = {
  icon: IconName
  key: RoleKeyType
  title: string
  description: string
  scanReason: ScanReasonEnum
  resolutionTypes?: ResolutionOffenceTypeEnum[]
  actions: { [key in ActionKeyType]?: boolean }
}

export const ROLES: RoleItem[] = [
  {
    key: RoleKey.Paas,
    icon: 'map',
    title: t('roles.paas.title'),
    description: t('roles.paas.description'),
    actions: {
      zone: true,
      offence: true,
      scanCheck: true,
    },
    resolutionTypes: [ResolutionOffenceTypeEnum.JustRegistration],
    scanReason: ScanReasonEnum.PaasParkingAuthorization,
  },
  {
    key: RoleKey.MunicipalPolice,
    icon: 'camera',
    title: t('roles.police.title'),
    description: t('roles.police.description'),
    actions: {
      subjective: true,
      offence: true,
    },
    scanReason: ScanReasonEnum.Other,
  },
  {
    key: RoleKey.Research,
    icon: 'outlined-flag',
    title: t('roles.research.title'),
    description: t('roles.research.description'),
    actions: {},
    scanReason: ScanReasonEnum.Research,
  },
]

export const getRoleByKey = (key?: string) => ROLES.find((role) => role.key === key)
