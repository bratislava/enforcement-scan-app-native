import { IconName } from '@/components/shared/Icon'
import {
  OffenceTypeEnum,
  ResolutionOffenceTypeEnum,
  ScanReasonEnum,
} from '@/modules/backend/openapi-generated'

export type RoleItem = {
  icon: IconName
  key: string
  title: string
  description: string
  scanReason: ScanReasonEnum
  actions: Record<string, boolean | string>
}

export const paasOffenceTypes: OffenceTypeEnum[] = [OffenceTypeEnum.A, OffenceTypeEnum.B]
export const paasResolutionTypes: ResolutionOffenceTypeEnum[] = [
  ResolutionOffenceTypeEnum.ForwardedToDi,
]

export const ROLES: RoleItem[] = [
  {
    key: 'paas',
    icon: 'map',
    title: 'PAAS',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    actions: {
      zone: true,
      offence: true,
      scanCheck: true,
      paasOffenceTypes: true,
    },
    scanReason: ScanReasonEnum.PaasParkingAuthorization,
  },
  {
    key: 'municipal-police',
    icon: 'camera',
    title: 'Policia mesta',
    description: 'Lorem ipsum dolor sit amet,consectetur adipiscing elit.',
    actions: {
      subjective: true,
      offence: true,
    },
    scanReason: ScanReasonEnum.Other,
  },
  {
    key: 'petrzalka',
    icon: 'outlined-flag',
    title: 'Testing',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    actions: {
      offence: true,
    },
    scanReason: ScanReasonEnum.PaasParkingAuthorization,
  },
  {
    key: 'research',
    icon: 'outlined-flag',
    title: 'Testovanie',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    actions: {},
    scanReason: ScanReasonEnum.Research,
  },
]

export const getRoleByKey = (key?: string) => ROLES.find((role) => role.key === key)
