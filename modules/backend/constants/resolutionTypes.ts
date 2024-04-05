import { ResolutionOffenceTypeEnum } from '@/modules/backend/openapi-generated'

// TODO: consult texts
export const RESOLUTION_TYPES = [
  { label: 'Blokovacie zariadenie', value: ResolutionOffenceTypeEnum.BlockingDevice },
  { label: 'Pokuta', value: ResolutionOffenceTypeEnum.Fine },
  { label: 'Odkaz na DI', value: ResolutionOffenceTypeEnum.ForwardedToDi },
  { label: 'Iba registrácia', value: ResolutionOffenceTypeEnum.JustRegistration },
  { label: 'Nepotrestané', value: ResolutionOffenceTypeEnum.NotCaught },
  { label: 'Oznámenie', value: ResolutionOffenceTypeEnum.Notification },
  { label: 'Papuča', value: ResolutionOffenceTypeEnum.SewedUp },
  { label: 'Neoprávnené oznámenie', value: ResolutionOffenceTypeEnum.UnjustifiedReport },
]

export const getResolutionTypeLabel = (type: ResolutionOffenceTypeEnum) =>
  RESOLUTION_TYPES.find((option) => option.value === type)?.label
