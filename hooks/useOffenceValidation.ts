import { useMemo } from 'react'

import { useIsOffenceAllowedOutsideZone } from '@/hooks/useIsOffenceAllowedOutsideZone'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { findContainingFeature } from '@/modules/map/utils/findContainingFeature'
import { useArcgisStoreContext } from '@/state/ArcgisStore/useArcgisStoreContext'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'

export interface ValidationResult {
  hasEmptyFields: boolean
  isOutsideZone?: boolean
  isOutsideOriginalZone?: boolean
}

export const useOffenceValidation = (): ValidationResult => {
  const { udrData } = useArcgisStoreContext()

  const { ecv, offenceType, roleKey, resolutionType, isObjectiveResponsibility, location, zone } =
    useOffenceStoreContext((state) => state)
  const isRoleWithZone = getRoleByKey(roleKey)?.actions.zone
  const isOffenceAllowedOutsideZone = useIsOffenceAllowedOutsideZone()

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

  const hasEmptyFields = useMemo(
    () => !ecv || !offenceType || (isObjectiveResponsibility ? false : !resolutionType),
    [ecv, offenceType, isObjectiveResponsibility, resolutionType],
  )

  return {
    hasEmptyFields,
    isOutsideZone,
    isOutsideOriginalZone,
  }
}
