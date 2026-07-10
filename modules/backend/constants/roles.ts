import { IconName } from '@/components/shared/Icon'
import { t } from '@/i18n.config'
import { ResolutionOffenceTypeEnum, ScanReasonEnum } from '@/modules/backend/openapi-generated'

export type RoleKeyType = 'paas' | 'municipal-police' | 'research'
export type ActionKeyType = 'zone' | 'offence' | 'scanCheck' | 'subjective'

export type RoleItem = {
  icon: IconName
  key: RoleKeyType
  title: string
  description: string
  scanReason: ScanReasonEnum
  resolutionTypes?: ResolutionOffenceTypeEnum[]
  offenceTypes?: string[]
  actions: { [key in ActionKeyType]?: boolean }
}

export const DZ_TYPES = [
  'DZ01',
  'DZ02',
  'DZ03',
  'DZ04',
  'DZ05',
  'DZ06',
  'DZ07',
  'DZ08',
  'DZ09',
  'DZ11',
]
export const N_TYPES = ['N01', 'N02']

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
    offenceTypes: ['O', 'N01', ...N_TYPES, ...DZ_TYPES],
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
  {
    key: 'research',
    icon: 'outlined-flag',
    title: t('roles.research.title'),
    description: t('roles.research.description'),
    actions: {},
    scanReason: ScanReasonEnum.Research,
  },
]

export const getRoleByKey = (key?: string) => ROLES.find((role) => role.key === key)
