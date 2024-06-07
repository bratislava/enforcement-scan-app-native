import { useNavigation } from 'expo-router'
import { forwardRef } from 'react'
import { AppState, useWindowDimensions } from 'react-native'
import { Camera, CameraProps, useCameraDevice, useCameraFormat } from 'react-native-vision-camera'

import { NoDeviceError } from '@/components/camera/NoDeviceError'

const ASPECT_RATIO = 16 / 9

const FullScreenCamera = forwardRef<Camera, Omit<Partial<CameraProps>, 'device'>>((props, ref) => {
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

  if (!device) return <NoDeviceError />

  return (
    <Camera
      ref={ref}
      photo
      format={format}
      device={device}
      style={{ height: width * ASPECT_RATIO }}
      isActive={focused && AppState.currentState === 'active'}
      {...props}
    />
  )
})

export default FullScreenCamera
