import { useCallback, useEffect, useState } from 'react'
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera'

import { useAppFocusEffect } from '@/hooks/useAppFocusEffect'
import { PermissionStatuses } from '@/modules/camera/constants'

export const useCameraPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState<CameraPermissionStatus>(
    PermissionStatuses.UNDETERMINED,
  )
  const [doNotAskAgain, setDoNotAskAgain] = useState(false)

  const checkPermission = useCallback(async () => {
    const status = await Camera.getCameraPermissionStatus()
    setPermissionStatus(status)
  }, [])

  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  useAppFocusEffect(checkPermission)

  const getPermission = useCallback(async () => {
    if (!doNotAskAgain) {
      setDoNotAskAgain(true)

      const requestedStatus = await Camera.requestCameraPermission()

      setPermissionStatus(requestedStatus)
    }
  }, [doNotAskAgain])

  return [permissionStatus, getPermission] as const
}
