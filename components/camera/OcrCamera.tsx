import { forwardRef } from 'react'
import {
  Camera,
  CameraProps,
  Frame,
  runAtTargetFps,
  useFrameProcessor,
} from 'react-native-vision-camera'
import { useTextRecognition } from 'react-native-vision-camera-text-recognition'
import { useRunOnJS } from 'react-native-worklets-core'

import FullScreenCamera from '@/components/camera/FullScreenCamera'
import { TextData } from '@/modules/camera/types'

type OcrCameraProps = Omit<CameraProps, 'device' | 'isActive' | 'frameProcessor'> & {
  onFrameCapture: (data: TextData, height: number) => void
}

const OcrCamera = forwardRef<Camera, OcrCameraProps>(({ onFrameCapture, ...props }, ref) => {
  const { scanText } = useTextRecognition()

  const runWorklet = useRunOnJS(
    (data: TextData, height: number): void => {
      onFrameCapture(data, height)
    },
    [onFrameCapture],
  )

  const frameProcessor = useFrameProcessor(
    (frame: Frame): void => {
      'worklet'

      runAtTargetFps(1, () => {
        try {
          // the scanText has wrong types from library so we need to cast it
          const data = scanText(frame) as unknown as TextData

          // the frame is rotated so width and height are swapped
          runWorklet(data, frame.width)
        } catch (error) {
          // catch block is here to handle error when accessing frames after unmounting camera
          // nothing should happen when this error occurs
        }
      })
    },
    [scanText, runWorklet],
  )

  return <FullScreenCamera ref={ref} frameProcessor={frameProcessor} {...props} />
})

export default OcrCamera
