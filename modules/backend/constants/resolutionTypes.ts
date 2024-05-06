import { t } from '@/i18n.config'
import { ResolutionOffenceTypeEnum } from '@/modules/backend/openapi-generated'

export const RESOLUTION_TYPES = [
  {
    label: t('offence.resolution.blockingDevice'),
    value: ResolutionOffenceTypeEnum.BlockingDevice,
  },
  { label: t('offence.resolution.fine'), value: ResolutionOffenceTypeEnum.Fine },
  { label: t('offence.resolution.forwardedToDi'), value: ResolutionOffenceTypeEnum.ForwardedToDi },
  {
    label: t('offence.resolution.justRegistration'),
    value: ResolutionOffenceTypeEnum.JustRegistration,
  },
  { label: t('offence.resolution.notCaught'), value: ResolutionOffenceTypeEnum.NotCaught },
  { label: t('offence.resolution.notification'), value: ResolutionOffenceTypeEnum.Notification },
  {
    label: t('offence.resolution.unjustifiedReport'),
    value: ResolutionOffenceTypeEnum.UnjustifiedReport,
  },
]

export const getResolutionTypeLabel = (type: ResolutionOffenceTypeEnum) =>
  RESOLUTION_TYPES.find((option) => option.value === type)?.label
