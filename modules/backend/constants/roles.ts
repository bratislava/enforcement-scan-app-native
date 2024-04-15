import { IconName } from '@/components/shared/Icon'
import {
  OffenceTypeEnum,
  ResolutionOffenceTypeEnum,
  ScanReasonEnum,
} from '@/modules/backend/openapi-generated'

export type RoleKeyType = 'paas' | 'municipal-police' | 'petrzalka' | 'research'
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
    },
    resolutionTypes: [ResolutionOffenceTypeEnum.ForwardedToDi],
    offenceTypes: [OffenceTypeEnum.N, OffenceTypeEnum.O],
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
    resolutionTypes: [ResolutionOffenceTypeEnum.ForwardedToDi],
    offenceTypes: [OffenceTypeEnum.N, OffenceTypeEnum.T],
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
