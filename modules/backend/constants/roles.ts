import { IconName } from '@/components/shared/Icon'

export type RoleItem = {
  icon: IconName
  key: string
  title: string
  description: string
  actions: Record<string, boolean>
}

export const ROLES: RoleItem[] = [
  {
    key: 'paas',
    icon: 'map',
    title: 'PAAS',
    description: 'Lorem ipsu dolor sit amet, consectetur adipiscing elit.',
    actions: {
      zone: true,
    },
  },
  {
    key: 'municipal-police',
    icon: 'camera',
    title: 'Ne PAAS',
    description: 'Lorem ipsum dolor sit amet,consectetur adipiscing elit.',
    actions: {
      subjective: true,
    },
  },
  {
    key: 'petrzalka',
    icon: 'outlined-flag',
    title: 'Testing',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    actions: {},
  },
  {
    key: 'testing',
    icon: 'outlined-flag',
    title: 'Testing',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    actions: {},
  },
]

export const getRoleByKey = (key: string) => ROLES.find((role) => role.key === key)
