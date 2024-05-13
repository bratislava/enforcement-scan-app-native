import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions, View } from 'react-native'
import {
  Camera,
  CameraProps,
  Frame,
  FrameProcessor,
  runAtTargetFps,
  useCameraDevice,
  useCameraFormat,
  useFrameProcessor,
} from 'react-native-vision-camera'
import { scanText, TextDataMap } from 'react-native-vision-camera-v3-text-recognition'

import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import { useRunInJS } from '@/utils/useRunInJS'

const ASPECT_RATIO = 16 / 9

type OcrCameraProps = Omit<CameraProps, 'device' | 'isActive' | 'frameProcessor'> & {
  onFrameCapture: (data: TextDataMap, height: number) => void
}

const OcrCamera = forwardRef<Camera, OcrCameraProps>(({ onFrameCapture, ...props }, ref) => {
  const { t } = useTranslation()

  const { width } = useWindowDimensions()
  const device = useCameraDevice('back')
  const format = useCameraFormat(device, [
    {
      videoResolution: { width, height: 720 },
    },
  ])

  const runWorklet = useRunInJS<
    void,
    [TextDataMap, number],
    (data: TextDataMap, height: number) => void
  >(
    (data: TextDataMap, height: number): void => {
      onFrameCapture(data, height)
    },
    [onFrameCapture],
  )

  const frameProcessor: FrameProcessor = useFrameProcessor(
    (frame: Frame): void => {
      'worklet'

      runAtTargetFps(1, () => {
        const data = scanText(frame, { language: 'latin' })

        // the frame is rotated so width and height are swapped
        runWorklet(data, frame.width)
      })
    },
    [runWorklet],
  )

  if (!device)
    return (
      <View className="h-full items-center bg-white pt-10">
        <ContentWithAvatar variant="error" title={t('camera.ocr.error.title')} />
      </View>
    )

  return (
    <Camera
      ref={ref}
      device={device}
      photo
      format={format}
      style={{ height: width * ASPECT_RATIO }}
      isActive
      frameProcessor={frameProcessor}
      {...props}
    />
  )
})

export default OcrCamera
