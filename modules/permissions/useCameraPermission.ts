import { useCallback, useEffect, useState } from 'react'
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera'

import { useAppFocusEffect } from '@/hooks/useAppFocusEffect'
import { PermissionStatuses } from '@/modules/camera/constants'

type Options =
  | {
      autoAsk?: boolean
    }
  | undefined

export const useCameraPermission = ({ autoAsk }: Options = {}) => {
  const [permissionStatus, setPermissionStatus] = useState<CameraPermissionStatus>(
    PermissionStatuses.UNDETERMINED,
  )
  const [doNotAskAgain, setDoNotAskAgain] = useState(false)

  const checkPermission = useCallback(async () => {
    const status = await Camera.getCameraPermissionStatus()
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

      const requestedStatus = await Camera.requestCameraPermission()

      setPermissionStatus(requestedStatus)
    }
  }, [doNotAskAgain])

  useEffect(() => {
    if (autoAsk) {
      getPermission()
    }
  }, [getPermission, autoAsk])

  return [permissionStatus, getPermission] as const
}
