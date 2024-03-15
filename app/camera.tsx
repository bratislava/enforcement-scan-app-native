import { TextRecognitionResult } from '@react-native-ml-kit/text-recognition'
import * as tf from '@tensorflow/tfjs'
import { cameraWithTensors } from '@tensorflow/tfjs-react-native'
import { Camera, FlashMode } from 'expo-camera'
import { useEffect, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import CameraBottomSheet from '@/components/camera/CameraBottomSheet'
import Typography from '@/components/shared/Typography'
// import modelFile from '@/models/2.tflite'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'

const TensorCamera = cameraWithTensors(Camera)

type TypedArray =
  | Float32Array
  | Float64Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | BigInt64Array
  | BigUint64Array

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
  // const plugin = useTensorflowModel(modelFile)
  // const model = plugin.state === 'loaded' ? plugin.model : undefined

  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off)
  const [tfReady, setTfReady] = useState(false)
  const [fps, setFps] = useState<number | null>(null)

  const { width } = useWindowDimensions()

  const { top } = useSafeAreaInsets()

  const [generatedEcv, setGeneratedEcv] = useState('')

  const [permissions] = useCameraPermission({ autoAsk: true })

  console.log(permissions)

  useEffect(() => {
    async function prepare() {
      await tf.ready()

      setTfReady(true)

      // const loadedModel = await loadTensorflowModel(require('@/models/2.tflite'))
      // setModel(loadedModel)

      console.log('modelReady')
    }

    prepare()
  }, [])

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleCameraStream = (images: IterableIterator<tf.Tensor3D>) => {
    console.log('camera ready')
    // console.log('imageTensor', imageTensor)
    let a = 0
    const loop = async () => {
      if (a % 100 === 0) {
        const imageTensor = images.next?.().value as tf.Tensor3D
        console.log('tensor', a, imageTensor)
        const startTs = Date.now()
        await Promise.resolve(setTimeout(() => {}, 2000))
        const ocrResult = model?.runSync([imageTensor])
        const latency = Date.now() - startTs
        setFps(Math.floor(1000 / latency))
        // console.log(ocrResult)
      }
      a += 1
      requestAnimationFrame(loop)
    }
    loop()
  }

  return (
    <View className="h-full flex-1 flex-col">
      {tfReady && (
        <TensorCamera
          ratio="16:9"
          style={{ height: (width * 16) / 9, zIndex: -1 }}
          flashMode={flashMode}
          onReady={handleCameraStream}
          cameraTextureHeight={(width * 16) / 9}
          cameraTextureWidth={width}
          useCustomShadersToResize={false}
          resizeHeight={200}
          resizeWidth={152}
          resizeDepth={3}
          autorender
        >
          <View className="z-10 h-full w-full">
            <View
              style={{ paddingTop: top, height: HEADER_WITH_PADDING + top }}
              className="items-center justify-center bg-dark/80"
            >
              <Typography className="text-white" variant="h1">
                Skenuj tu, FPS: {fps}
              </Typography>
            </View>
            <View style={{ height: CROPPED_PHOTO_HEIGHT }} className="items-center" />
            <View className="bg-opacity-20 flex-1 items-center bg-dark/80" />
          </View>
        </TensorCamera>
      )}

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
