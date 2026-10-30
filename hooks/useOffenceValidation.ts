import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useIsOffenceAllowedOutsideZone } from '@/hooks/useIsOffenceAllowedOutsideZone'
import { getOffenceTypes } from '@/modules/backend/constants/queryOptions'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { findContainingFeature } from '@/modules/map/utils/findContainingFeature'
import { useArcgisStoreContext } from '@/state/ArcgisStore/useArcgisStoreContext'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'

export interface ValidationResult {
  hasEmptyFields: boolean
  isOffenceTypeMissing: boolean
  isOutsideZone?: boolean
  isOutsideOriginalZone?: boolean
}

export const useOffenceValidation = (): ValidationResult => {
  const { udrData } = useArcgisStoreContext()

  const { ecv, offenceType, roleKey, resolutionType, isObjectiveResponsibility, location, zone } =
    useOffenceStoreContext((state) => state)
  const isRoleWithZone = getRoleByKey(roleKey)?.actions.zone
  const isOffenceAllowedOutsideZone = useIsOffenceAllowedOutsideZone()
  const { data: offenceTypes } = useQuery(getOffenceTypes())

  const gpsZone = useMemo(
    () =>
      location && udrData && findContainingFeature(udrData.features, [location.long, location.lat]),
    [location, udrData],
  )

  const isOutsideZone = useMemo(
    () => isRoleWithZone && !isOffenceAllowedOutsideZone(offenceType) && !gpsZone,
    [isRoleWithZone, isOffenceAllowedOutsideZone, offenceType, gpsZone],
  )

  const isOutsideOriginalZone = useMemo(
    () =>
      isRoleWithZone &&
      !isOffenceAllowedOutsideZone(offenceType) &&
      zone?.id !== gpsZone?.properties.id,
    [isRoleWithZone, isOffenceAllowedOutsideZone, offenceType, zone?.id, gpsZone?.properties.id],
  )

  // Treat codes missing from the current offence type list (e.g. deprecated ones) as not selected
  const isOffenceTypeMissing = useMemo(
    () =>
      !offenceTypes?.some(
        (option) => option.code === offenceType && (roleKey !== 'paas' || option.paasVisible),
      ),
    [offenceTypes, offenceType, roleKey],
  )

  const hasEmptyFields = useMemo(
    () => !ecv || isOffenceTypeMissing || (isObjectiveResponsibility ? false : !resolutionType),
    [ecv, isOffenceTypeMissing, isObjectiveResponsibility, resolutionType],
  )

  return {
    hasEmptyFields,
    isOffenceTypeMissing,
    isOutsideZone,
    isOutsideOriginalZone,
  }
}
