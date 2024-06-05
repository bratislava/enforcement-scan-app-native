import { useNavigation } from 'expo-router'
import { forwardRef, useEffect, useState } from 'react'
import { AppState, useWindowDimensions } from 'react-native'
import { Camera, CameraProps, useCameraDevice, useCameraFormat } from 'react-native-vision-camera'

import { NoDeviceError } from '@/components/camera/NoDeviceError'

const ASPECT_RATIO = 16 / 9

const FullScreenCamera = forwardRef<Camera, Omit<CameraProps, 'device' | 'isActive'>>(
  (props, ref) => {
    const navigation = useNavigation()
    const focused = navigation.isFocused()

    const { width } = useWindowDimensions()
    const device = useCameraDevice('back')

    const format = useCameraFormat(device, [
      {
        photoAspectRatio: ASPECT_RATIO,
        photoResolution: { width, height: width * ASPECT_RATIO },
        videoResolution: { width, height: 720 },
      },
    ])

    // The react-native-vision-camera has an android issue with stretching that is fixed in v4 (release was in may 2024), but text recognition library doesn't support v4 yet, so the temporary fix is needed here
    // the fix includes hiding the camera for a short time and then showing it again while changing height by 1 px on initialize...
    // ISSUE: https://github.com/mrousavy/react-native-vision-camera/issues/2583
    // TODO: update to v4 when text recognition library supports it (the library is maintained so it's just a matter of time)
    const [showCamera, setShowCamera] = useState(false)
    const [isInitialized, setIsInitialized] = useState(1)

    useEffect(() => {
      setShowCamera(false)
      const timeout = setTimeout(() => {
        setShowCamera(true)
      }, 100)

      return () => clearTimeout(timeout)
    }, [])

    if (!device) return <NoDeviceError />

    return showCamera ? (
      <Camera
        onInitialized={() => setIsInitialized(0)}
        ref={ref}
        photo
        format={format}
        device={device}
        style={{ height: width * ASPECT_RATIO + isInitialized }}
        isActive={focused && AppState.currentState === 'active'}
        {...props}
      />
    ) : null
  },
)

export default FullScreenCamera
