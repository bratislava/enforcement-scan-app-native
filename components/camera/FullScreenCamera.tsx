import { forwardRef } from 'react'
import { useWindowDimensions } from 'react-native'
import { Camera, CameraProps, useCameraDevice, useCameraFormat } from 'react-native-vision-camera'

const ASPECT_RATIO = 16 / 9

const FullScreenCamera = forwardRef<Camera, Omit<CameraProps, 'device' | 'isActive'>>(
  (props, ref) => {
    const { width } = useWindowDimensions()
    const device = useCameraDevice('back')
    const format = useCameraFormat(device, [
      {
        photoAspectRatio: ASPECT_RATIO,
        photoResolution: { width, height: width * ASPECT_RATIO },
      },
    ])
    if (!device) return null

    return (
      <Camera
        ref={ref}
        photo
        format={format}
        device={device}
        style={{ height: width * ASPECT_RATIO }}
        isActive
        {...props}
      />
    )
  },
)

export default FullScreenCamera
