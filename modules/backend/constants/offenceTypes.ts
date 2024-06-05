import { t } from '@/i18n.config'
import { OffenceTypeEnum } from '@/modules/backend/openapi-generated'

export const OFFENCE_TYPES = [
  { label: t('offence.type.3/2b'), value: OffenceTypeEnum.Dz },
  { label: t('offence.type.25/1a'), value: OffenceTypeEnum.A },
  { label: t('offence.type.25/1b'), value: OffenceTypeEnum.B },
  { label: t('offence.type.25/1c'), value: OffenceTypeEnum.C },
  { label: t('offence.type.25/1d'), value: OffenceTypeEnum.D },
  { label: t('offence.type.25/1e'), value: OffenceTypeEnum.E },
  { label: t('offence.type.25/1f'), value: OffenceTypeEnum.F },
  { label: t('offence.type.25/1g'), value: OffenceTypeEnum.G },
  { label: t('offence.type.25/1h'), value: OffenceTypeEnum.H },
  { label: t('offence.type.25/1i'), value: OffenceTypeEnum.I },
  { label: t('offence.type.25/1j'), value: OffenceTypeEnum.J },
  { label: t('offence.type.25/1k'), value: OffenceTypeEnum.K },
  { label: t('offence.type.25/1l'), value: OffenceTypeEnum.L },
  { label: t('offence.type.25/1m'), value: OffenceTypeEnum.M },
  { label: t('offence.type.25/1n'), value: OffenceTypeEnum.N },
  { label: t('offence.type.25/1o'), value: OffenceTypeEnum.O },
  { label: t('offence.type.25/1p'), value: OffenceTypeEnum.P },
  { label: t('offence.type.25/1q'), value: OffenceTypeEnum.Q },
  { label: t('offence.type.25/1r'), value: OffenceTypeEnum.R },
  { label: t('offence.type.25/1s'), value: OffenceTypeEnum.S },
  { label: t('offence.type.25/1t'), value: OffenceTypeEnum.T },
  { label: t('offence.type.25/1u'), value: OffenceTypeEnum.U },
]

export const getOffenceTypeLabel = (type: OffenceTypeEnum) =>
  OFFENCE_TYPES.find((option) => option.value === type)?.label
