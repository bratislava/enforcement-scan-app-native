import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { getOffenceTypes } from '@/modules/backend/constants/queryOptions'

export const useOffenceTypeLabel = () => {
  const { data: offenceTypes } = useQuery(getOffenceTypes())

  return useCallback(
    (offenceType?: string) => offenceTypes?.find((option) => option.code === offenceType)?.name,
    [offenceTypes],
  )
}
