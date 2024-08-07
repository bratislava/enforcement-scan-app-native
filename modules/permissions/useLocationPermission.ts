import * as Location from 'expo-location'
import { useCallback, useEffect, useState } from 'react'

import { useAppFocusEffect } from '@/hooks/useAppFocusEffect'

export const useLocationPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus>(
    Location.PermissionStatus.UNDETERMINED,
  )

  const [doNotAskAgain, setDoNotAskAgain] = useState(false)

  const checkPermission = useCallback(async () => {
    const { status } = await Location.getForegroundPermissionsAsync()
    setPermissionStatus(status)
  }, [])

  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  useAppFocusEffect(checkPermission)

  const getPermission = useCallback(async () => {
    if (!doNotAskAgain) {
      setDoNotAskAgain(true)

      const { status: currentStatus, canAskAgain } = await Location.getForegroundPermissionsAsync()

      if (
        currentStatus === Location.PermissionStatus.UNDETERMINED ||
        (currentStatus === Location.PermissionStatus.DENIED && canAskAgain)
      ) {
        const { status } = await Location.requestForegroundPermissionsAsync()
        setPermissionStatus(status)

        return
      }

      setPermissionStatus(currentStatus)
    }
  }, [doNotAskAgain])

  return [permissionStatus, getPermission] as const
}
