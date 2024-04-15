import { OffenceTypeEnum } from '@/modules/backend/openapi-generated'

// TODO: add texts
export const OFFENCE_TYPES = [
  { label: 'Neoprávn. státie &25/1', value: OffenceTypeEnum.A },
  { label: 'Podľa značky &25/1/', value: OffenceTypeEnum.A },
  { label: 'Státie v zákrute &25/1/a', value: OffenceTypeEnum.A },
  { label: 'Státie pred vrcholom &25/1/b', value: OffenceTypeEnum.B },
  { label: 'Státie na prechode &25/1/c', value: OffenceTypeEnum.C },
  { label: 'Státie na križovatke &25/1/d', value: OffenceTypeEnum.D },
  { label: 'Prip. alebo odboč. pruhu &25/1/e', value: OffenceTypeEnum.E },
  { label: 'Státie pre MHD &25/1/f', value: OffenceTypeEnum.F },
  { label: 'Státie na priecestí/tunel &25/1/g', value: OffenceTypeEnum.G },
  { label: 'Zakrytie značky &25/1/h', value: OffenceTypeEnum.H },
  { label: 'Vnútorný jazdný pruh &25/1/i', value: OffenceTypeEnum.I },
  { label: 'Vyhradený jazdný pruh &25/1/j', value: OffenceTypeEnum.J },
  { label: 'Cyklotrasa &25/1/k', value: OffenceTypeEnum.K },
  { label: 'Nástupný ostorček &25/1/l', value: OffenceTypeEnum.L },
  { label: 'Státie na moste &25/1/m', value: OffenceTypeEnum.M },
  { label: 'Státie na vyhr. m. &25/1/n', value: OffenceTypeEnum.N },
  { label: 'Vnutrobloky &25/1/n', value: OffenceTypeEnum.N },
  { label: 'Neoprávn. státie &25/1/o', value: OffenceTypeEnum.O },
  { label: 'Státie na el. páse &25/1/p', value: OffenceTypeEnum.P },
  { label: 'Státie na chodníku &25/1/q', value: OffenceTypeEnum.Q },
  { label: 'Státie na kruh. ob. &25/1/r', value: OffenceTypeEnum.R },
  { label: 'Státie na zeleni &25/1/s', value: OffenceTypeEnum.S },
  { label: 'Pri el. kolajnici &25/1/t', value: OffenceTypeEnum.T },
  { label: 'Neoprávn. státie &25/1/u', value: OffenceTypeEnum.T },
]

export const getOffenceTypeLabel = (type: OffenceTypeEnum) =>
  OFFENCE_TYPES.find((option) => option.value === type)?.label
