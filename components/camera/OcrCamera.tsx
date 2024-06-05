import { forwardRef } from 'react'
import {
  Camera,
  CameraProps,
  Frame,
  FrameProcessor,
  runAtTargetFps,
  useFrameProcessor,
} from 'react-native-vision-camera'
import { useTextRecognition } from 'react-native-vision-camera-v3-text-recognition'
import { Text } from 'react-native-vision-camera-v3-text-recognition/lib/typescript/src/types'

import FullScreenCamera from '@/components/camera/FullScreenCamera'
import { useRunInJS } from '@/utils/useRunInJS'

type OcrCameraProps = Omit<CameraProps, 'device' | 'isActive' | 'frameProcessor'> & {
  onFrameCapture: (data: Text, height: number) => void
}

const OcrCamera = forwardRef<Camera, OcrCameraProps>(({ onFrameCapture, ...props }, ref) => {
  const { scanText } = useTextRecognition()

  const runWorklet = useRunInJS<void, [Text, number], (data: Text, height: number) => void>(
    (data: Text, height: number): void => {
      onFrameCapture(data, height)
    },
    [onFrameCapture],
  )

  const frameProcessor: FrameProcessor = useFrameProcessor(
    (frame: Frame): void => {
      'worklet'

      runAtTargetFps(1, () => {
        try {
          const data = scanText(frame)

          // the frame is rotated so width and height are swapped
          runWorklet(data, frame.width)
        } catch (error) {
          // catch block is here to handle error when accessing frames after unmounting camera
          // nothing should happen when this error occurs
        }
      })
    },
    [runWorklet, scanText],
  )

  return <FullScreenCamera ref={ref} frameProcessor={frameProcessor} {...props} />
})

export default OcrCamera
