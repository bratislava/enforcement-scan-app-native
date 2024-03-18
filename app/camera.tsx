import TextRecognition, { TextRecognitionResult } from '@react-native-ml-kit/text-recognition'
import * as tf from '@tensorflow/tfjs'
import { cameraWithTensors } from '@tensorflow/tfjs-react-native'
import { Camera, FlashMode } from 'expo-camera'
import * as FileSystem from 'expo-file-system'
import { FlipType, manipulateAsync } from 'expo-image-manipulator'
import * as jpeg from 'jpeg-js'
import { useEffect, useState } from 'react'
import { Image, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import CameraBottomSheet from '@/components/camera/CameraBottomSheet'
import Typography from '@/components/shared/Typography'
// import modelFile from '@/models/2.tflite'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'

const TensorCamera = cameraWithTensors(Camera)

type EncodingResult = { uri: string; width: number; height: number } | undefined

const encodeJpeg = async (tensor: tf.Tensor3D): Promise<EncodingResult> => {
  if (!tensor) return
  const height = tensor?.shape[0]
  const width = tensor?.shape[1]

  const startTs = Date.now()

  const { concat, util } = tf

  const data = Buffer.from(
    // @eslint-disable-next-line @typescript-eslint/no-unsafe-call
    concat([tensor, tf.ones([height, width, 1]).mul(255)], [-1])
      .slice([0], [height, width, 4])
      .dataSync(),
  )

  const rawImageData = { data, width, height }
  const jpegImageData = jpeg.encode(rawImageData, 40)

  const imgBase64 = util.decodeString(jpegImageData.data, 'base64')
  const uri = `${FileSystem.cacheDirectory}tensor.jpg`
  await FileSystem.writeAsStringAsync(uri, imgBase64, {
    encoding: FileSystem.EncodingType.Base64,
  })

  const latency = Date.now() - startTs
  console.log('time to process in seconds:', latency / 1000)

  return { uri, width, height }
}

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
const RESIZED_WIDTH = 152

const CameraComp = () => {
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off)

  const [imageUri, setImageUri] = useState<string>('')

  const [loading, setLoading] = useState(false)
  const [tfReady, setTfReady] = useState(false)
  const [, setTensorsToProcess] = useState<tf.Tensor3D[]>([])

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

  const processNextItem = () => {
    setTensorsToProcess((prevQueue) => {
      if (prevQueue.length === 0) {
        return prevQueue // No items to process
      }
      // Process the first item in the queue
      const imageTensor = prevQueue[0]
      // Process the item here
      encodeJpeg(imageTensor)
        .then(async (res) => {
          if (!res) return
          const { uri, width: originalWidth, height: originalHeight } = res

          const { originY, height: newHeight } = getPhotoOriginY(originalHeight)

          const croppedPhoto = await manipulateAsync(uri, [
            {
              crop: { originX: 0, originY, width: originalWidth, height: newHeight },
            },
            {
              flip: FlipType.Horizontal,
            },
          ])

          setImageUri(croppedPhoto.uri)
          const newOcr = await TextRecognition.recognize(croppedPhoto.uri)

          if (!newOcr) return

          setLoading(false)
          setGeneratedEcv(
            biggestText(newOcr)
              .replaceAll(/(\r\n|\n|\r|\s)/gm, '')
              .replaceAll(/[^\dA-Z]/g, ''),
          )
        })
        .catch((error) => console.log(error))

      // Remove the processed item from the queue
      return prevQueue.slice(1)
    })
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      processNextItem()
    }, 100)

    return () => clearInterval(intervalId) // Clean up on component unmount
  }, [])

  useEffect(() => {
    async function prepare() {
      await tf.ready()

      setTfReady(true)
    }

    prepare()
  }, [])

  const handleCameraStream = (images: IterableIterator<tf.Tensor3D>) => {
    let a = 0
    const loop = async () => {
      if (a % 100 === 0) {
        const imageTensor = images.next?.().value as tf.Tensor3D

        setTensorsToProcess((prev) => [...prev, imageTensor])
      }
      a += 1
      requestAnimationFrame(loop)
    }
    loop()
  }

  return (
    <View className="h-full flex-1 flex-col">
      <View className="relative">
        {tfReady && (
          <TensorCamera
            ratio="16:9"
            style={{ height: (width * 16) / 9, zIndex: -20 }}
            flashMode={flashMode}
            onReady={handleCameraStream}
            cameraTextureHeight={(width * 16) / 9}
            cameraTextureWidth={width}
            useCustomShadersToResize={false}
            resizeHeight={(RESIZED_WIDTH * 16) / 9}
            resizeWidth={RESIZED_WIDTH}
            resizeDepth={3}
            autorender
          />
        )}
        <View className="absolute bottom-0 left-0 right-0 top-0 h-full w-full">
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
          {imageUri ? <Image src={imageUri} className="h-48 w-48" resizeMode="contain" /> : null}
        </View>
      </View>

      <CameraBottomSheet
        isLoading={false}
        flashMode={flashMode}
        toggleFlashlight={() =>
          setFlashMode((prev) => (prev === FlashMode.off ? FlashMode.torch : FlashMode.off))
        }
        licencePlate={generatedEcv}
        onChangeLicencePlate={(ecv) => setGeneratedEcv(ecv)}
      />
    </View>
  )
}

export default CameraComp
