import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions, View } from 'react-native'
import {
  Camera,
  CameraProps,
  Frame,
  FrameProcessor,
  useCameraDevice,
  useCameraFormat,
  useFrameProcessor,
} from 'react-native-vision-camera'
import { scanText, TextDataMap } from 'react-native-vision-camera-v3-text-recognition'

import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import { useRunInJS } from '@/utils/useRunInJS'

const ASPECT_RATIO = 16 / 9

type OcrCameraProps = Omit<CameraProps, 'device' | 'isActive' | 'frameProcessor'> & {
  onFrameCapture: (data: TextDataMap) => void
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

  const runWorklet = useRunInJS<void, [TextDataMap], (data: TextDataMap) => void>(
    (data: TextDataMap): void => {
      onFrameCapture(data)
    },
    [onFrameCapture],
  )

  const frameProcessor: FrameProcessor = useFrameProcessor(
    (frame: Frame): void => {
      'worklet'

      // 30 frames per second means that frame is updated every 33.3ms we need to scan only one frame per second
      if (new Date().getMilliseconds() < 34) {
        const data = scanText(frame, { language: 'latin' })

        runWorklet(data)
      }
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
      format={format}
      style={{ height: width * ASPECT_RATIO }}
      isActive
      frameProcessor={frameProcessor}
      {...props}
    />
  )
})

export default OcrCamera
