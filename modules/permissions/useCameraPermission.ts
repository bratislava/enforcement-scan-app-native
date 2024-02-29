import { Camera, PermissionStatus } from 'expo-camera'
import { useCallback, useEffect, useState } from 'react'

import { useAppFocusEffect } from '@/hooks/useAppFocusEffect'

type Options =
  | {
      autoAsk?: boolean
    }
  | undefined

export const useCameraPermission = ({ autoAsk }: Options = {}) => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED,
  )
  const [doNotAskAgain, setDoNotAskAgain] = useState(false)

  const checkPermission = useCallback(async () => {
    const { status } = await Camera.getCameraPermissionsAsync()
    setPermissionStatus(status)
    console.log('status', status)
  }, [])

  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  useAppFocusEffect(checkPermission)

  const getPermission = useCallback(async () => {
    if (!doNotAskAgain) {
      setDoNotAskAgain(true)

      const { status: currentStatus } = await Camera.getCameraPermissionsAsync()
      console.log('currentStatus', currentStatus)

      if (currentStatus === PermissionStatus.UNDETERMINED) {
        const { status } = await Camera.requestCameraPermissionsAsync()
        console.log('currentStatus2', status)
        setPermissionStatus(status)

        return
      }

      setPermissionStatus(currentStatus)
    }
  }, [doNotAskAgain])

  useEffect(() => {
    if (autoAsk) {
      getPermission()
    }
  }, [getPermission, autoAsk])

  return [permissionStatus, getPermission] as const
}
