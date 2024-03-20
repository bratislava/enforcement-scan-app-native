import TextRecognition, { TextRecognitionResult } from '@react-native-ml-kit/text-recognition'
import { Camera, FlashMode } from 'expo-camera'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { useRef, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import CameraBottomSheet from '@/components/camera/CameraBottomSheet'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'

const biggestText = (ocr: TextRecognitionResult) => {
  const ocrs = ocr?.blocks
    .filter(({ frame }) => !!frame)
    .map((block) => ({
      ...block,
      surfaceArea: block.frame ? block.frame.width * block.frame.height : 0,
    }))

  const numbers = ocrs.map(({ surfaceArea }) => surfaceArea)

  if (!Array.isArray(numbers) || numbers.length === 0) return ''

  const index = numbers.indexOf(Math.max(...numbers))

  return ocrs[index].text
}

const HEADER_WITH_PADDING = 64
const CROPPED_PHOTO_HEIGHT = 150

const CameraComp = () => {
  const ref = useRef<Camera>(null)
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off)
  const [loading, setLoading] = useState(false)
  const [, setOcr] = useState<TextRecognitionResult | null>(null)
  const { width } = useWindowDimensions()

  const { top } = useSafeAreaInsets()

  const [generatedEcv, setGeneratedEcv] = useState('')

  useCameraPermission({ autoAsk: true })

  /**
   * Get the originY and height of the cropped part for the photo from the camera
   */
  const getPhotoOriginY = (photoHeight: number) => {
    const cameraHeight = (width * 16) / 9
    // 64 is the height of the header with padding
    const topHeightRatio = (top + HEADER_WITH_PADDING) / cameraHeight
    // 200 is the height of the cropped part
    const croppedHeightRatio = CROPPED_PHOTO_HEIGHT / cameraHeight

    return {
      originY: photoHeight * topHeightRatio,
      height: photoHeight * croppedHeightRatio,
    }
  }

  const takePicture = async () => {
    const date = new Date()
    setLoading(true)
    const photo = await ref.current?.takePictureAsync()

    if (!photo) return
    const { originY, height } = getPhotoOriginY(photo.height)

    const croppedPhoto = await manipulateAsync(
      photo.uri,
      [
        {
          crop: { originX: 0, originY, width: photo.width, height },
        },
      ],
      {
        compress: 0.5,
        format: SaveFormat.JPEG,
      },
    )
    const newOcr = await TextRecognition.recognize(croppedPhoto.uri)

    if (newOcr)
      setGeneratedEcv(
        biggestText(newOcr)
          .replaceAll(/(\r\n|\n|\r|\s)/gm, '')
          .replaceAll(/[^\dA-Z]/g, ''),
      )
    setOcr(newOcr)
    setLoading(false)
    console.log('Time function took in seconds:', (Date.now() - date.getTime()) / 1000)
  }

  return (
    <ScreenView options={{ headerShown: false }} className="h-full flex-1 flex-col">
      <Camera ratio="16:9" ref={ref} style={{ height: (width * 16) / 9 }} flashMode={flashMode}>
        <View className="h-full w-full">
          <View
            style={{ paddingTop: top, height: HEADER_WITH_PADDING + top }}
            className="items-center justify-center bg-dark/80"
          >
            <Typography className="text-white" variant="h1">
              Skenuj tu
            </Typography>
          </View>
          <View style={{ height: CROPPED_PHOTO_HEIGHT }} className="items-center" />
          <View className="bg-opacity-20 flex-1 items-center bg-dark/80" />
        </View>
      </Camera>

      <CameraBottomSheet
        isLoading={loading}
        flashMode={flashMode}
        toggleFlashlight={() =>
          setFlashMode((prev) => (prev === FlashMode.off ? FlashMode.torch : FlashMode.off))
        }
        licencePlate={generatedEcv}
        takePicture={takePicture}
        onChangeLicencePlate={(ecv) => setGeneratedEcv(ecv)}
      />
    </ScreenView>
  )
}

export default CameraComp
