import TextRecognition, { TextRecognitionResult } from '@react-native-ml-kit/text-recognition'
import { Camera, FlashMode } from 'expo-camera'
import { useRef, useState } from 'react'
import { View } from 'react-native'

import CameraBottomSheet from '@/components/camera/CameraBottomSheet'
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

const CameraComp = () => {
  const ref = useRef<Camera>(null)
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off)
  const [ocr, setOcr] = useState<TextRecognitionResult | null>(null)

  const [generatedEcv, setGeneratedEcv] = useState('')

  useCameraPermission({ autoAsk: true })

  const takePicture = async () => {
    // const photo = await ref.current?.takePictureAsync()

    // if (!photo) return
    const newOcr = await TextRecognition.recognize(
      'https://cmesk-ott-images-tvnoviny.ssl.cdn.cra.cz/r1200x/ce33a720-ed42-4e80-aecd-1b8371c83f55.jpg',
    )

    if (newOcr) setGeneratedEcv(biggestText(newOcr).replaceAll(/(\r\n|\n|\r|\s)/gm, ''))
    setOcr(newOcr)
  }

  return (
    <View className="bg-red h-full flex-1 flex-col">
      <Camera ref={ref} style={{ flex: 1 }} flashMode={flashMode} />

      <CameraBottomSheet
        flashMode={flashMode}
        toggleFlashlight={() =>
          setFlashMode((prev) => (prev === FlashMode.off ? FlashMode.on : FlashMode.off))
        }
        licencePlate={generatedEcv}
        takePicture={takePicture}
        onChangeLicencePlate={(ecv) => setGeneratedEcv(ecv.toUpperCase())}
      />
    </View>
  )
}

export default CameraComp
