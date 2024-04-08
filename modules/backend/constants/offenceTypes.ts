import { OffenceTypeEnum } from '@/modules/backend/openapi-generated'

// TODO: add texts
export const OFFENCE_TYPES = [
  { label: 'Offence type 1', value: OffenceTypeEnum.A },
  { label: 'Offence type 2', value: OffenceTypeEnum.B },
  { label: 'Offence type 3', value: OffenceTypeEnum.C },
]

export const getOffenceTypeLabel = (type: OffenceTypeEnum) =>
  OFFENCE_TYPES.find((option) => option.value === type)?.label
