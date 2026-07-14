import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { getOffenceTypes } from '@/modules/backend/constants/queryOptions'

const OFFENCE_CATEGORIES_ALLOWED_OUTSIDE_ZONE = new Set(['DZ'])

export const useIsOffenceAllowedOutsideZone = () => {
  const { data: offenceTypes } = useQuery(getOffenceTypes())

  return useCallback(
    (code?: string) => {
      const offenceType = offenceTypes?.find((option) => option.code === code)?.offenceType

      return !!offenceType && OFFENCE_CATEGORIES_ALLOWED_OUTSIDE_ZONE.has(offenceType)
    },
    [offenceTypes],
  )
}
