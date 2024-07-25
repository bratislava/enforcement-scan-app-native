import { forwardRef } from 'react'
import { Camera, CameraProps, useCameraDevice, useCameraFormat } from 'react-native-vision-camera'

import { NoDeviceError } from '@/components/camera/NoDeviceError'
import { useAppState } from '@/hooks/useAppState'
import { useIsFocused } from '@/hooks/useIsFocused'

const ASPECT_RATIO = 16 / 9
const width = 360

const FullScreenCamera = forwardRef<Camera, Omit<Partial<CameraProps>, 'device'>>((props, ref) => {
  const focused = useIsFocused()
  const appState = useAppState()

  const device = useCameraDevice('back')

  const resolution = { width, height: width * ASPECT_RATIO }

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
      onError={(error) => console.error('Camera error', error)}
      device={device}
      style={{ height: width * ASPECT_RATIO }}
      isActive={focused && appState === 'active'}
      {...props}
    />
  )
})

export default FullScreenCamera
