import { Camera, CameraProps } from 'expo-camera'
import { forwardRef } from 'react'
import { useWindowDimensions } from 'react-native'

const ASPECT_RATIO = 16 / 9

const FullScreenCamera = forwardRef<Camera, CameraProps>((props, ref) => {
  const { width } = useWindowDimensions()

  // height computation takes place for camera to not have disorted view and aspect ratio to be 16:9
  return <Camera ratio="16:9" ref={ref} style={{ height: width * ASPECT_RATIO }} {...props} />
})

export default FullScreenCamera
