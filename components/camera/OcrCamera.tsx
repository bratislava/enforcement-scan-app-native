import { forwardRef } from 'react'
import { Camera, CameraProps, Frame, useFrameProcessor } from 'react-native-vision-camera'
import { useTextRecognition } from 'react-native-vision-camera-text-recognition'
import { useRunOnJS } from 'react-native-worklets-core'

import FullScreenCamera from '@/components/camera/FullScreenCamera'
import { TextData } from '@/modules/camera/types'
import { runAsync } from '@/utils/runAsync'

type OcrCameraProps = Omit<CameraProps, 'device' | 'isActive' | 'frameProcessor'> & {
  onFrameCapture: (data: TextData) => void
}

const width = 640
const height = 360

const OcrCamera = forwardRef<Camera, OcrCameraProps>(({ onFrameCapture, ...props }, ref) => {
  const { scanText } = useTextRecognition()

  const device = useCameraDevice('back')

  const format = useCameraFormat(device, [
    {
      photoAspectRatio: width / height,
      photoResolution: { width, height },
      videoResolution: { width, height },
    },
  ])

  const runWorklet = useRunOnJS(
    (data: TextData): void => {
      onFrameCapture(data)
    },
    [onFrameCapture],
  )

  const frameProcessor = useFrameProcessor(
    (frame: Frame): void => {
      'worklet'

      runAsync(frame, () => {
        'worklet'

        try {
          // the scanText has wrong types from library so we need to cast it
          const data = scanText(frame) as unknown as TextData

          runWorklet(data)
        } catch (error) {
          // catch block is here to handle error when accessing frames after unmounting camera
          // nothing should happen when this error occurs
        }
      })
    },
    [scanText, runWorklet],
  )

  return <FullScreenCamera format={format} ref={ref} frameProcessor={frameProcessor} {...props} />
})

export default OcrCamera
