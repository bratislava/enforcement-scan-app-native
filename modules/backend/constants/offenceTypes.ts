import { OffenceTypesDto } from '@/modules/backend/openapi-generated'

export const getOffenceTypeLabel = (
  offenceTypes: OffenceTypesDto[] | undefined,
  offenceType?: string,
) => offenceTypes?.find((option) => option.code === offenceType)?.name
