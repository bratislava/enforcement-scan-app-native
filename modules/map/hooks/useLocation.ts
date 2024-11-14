import * as Location from 'expo-location'
import { useCallback, useEffect, useState } from 'react'

import { getCurrentPositionAsync } from '@/modules/map/utils/getCurrentPositionAsync'
import { useLocationPermission } from '@/modules/permissions/useLocationPermission'

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [permissionStatus] = useLocationPermission()

  const getCurrentPosition = useCallback(async () => {
    const currentPosition = await getCurrentPositionAsync()
    setLocation(currentPosition)
  }, [])

  const getLocation = useCallback(async () => {
    if (permissionStatus !== Location.PermissionStatus.GRANTED) return

    const lastKnownPosition = await Location.getLastKnownPositionAsync()
    setLocation(lastKnownPosition)
    getCurrentPosition()
  }, [permissionStatus, getCurrentPosition])

  useEffect(() => {
    getLocation().catch((error) => {
      console.warn(error)
      setLocation(null)
    })
  }, [getLocation])

  return [location, getLocation] as const
}
