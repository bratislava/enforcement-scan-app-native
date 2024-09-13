import { forwardRef } from 'react'
import { useWindowDimensions } from 'react-native'
import { Camera, CameraProps, useCameraDevice, useCameraFormat } from 'react-native-vision-camera'

import { NoDeviceError } from '@/components/camera/NoDeviceError'
import { useAppState } from '@/hooks/useAppState'
import { useIsFocused } from '@/hooks/useIsFocused'
import { useFlashlightContext } from '@/modules/camera/state/useFlashlightContext'

const ASPECT_RATIO = 16 / 9
const photoWidth = 720

const FullScreenCamera = forwardRef<Camera, Omit<Partial<CameraProps>, 'device'>>((props, ref) => {
  const focused = useIsFocused()
  const appState = useAppState()
  const { width } = useWindowDimensions()

  const { torch } = useFlashlightContext()
  const device = useCameraDevice('back')

  const resolution = { width: photoWidth, height: photoWidth * ASPECT_RATIO }
  const format = useCameraFormat(device, [
    {
      photoAspectRatio: ASPECT_RATIO,
      photoResolution: resolution,
      videoResolution: resolution,
    },
  ])

  if (!device) return <NoDeviceError />

  return (
    <Camera
      ref={ref}
      photo
      format={format}
      torch={torch}
      onError={(error) => console.error('Camera error', error)}
      device={device}
      style={{ height: width * ASPECT_RATIO }}
      isActive={focused && appState === 'active'}
      {...props}
    />
  )
})

export default FullScreenCamera
