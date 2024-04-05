import { Camera, FlashMode } from 'expo-camera'
import { useRef, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import LicencePlateCameraBottomSheet from '@/components/camera/LicencePlateCameraBottomSheet'
import ScreenView from '@/components/screen-layout/ScreenView'
import {
  CROPPED_PHOTO_HEIGHT,
  HEADER_WITH_PADDING,
  useScanLicencePlate,
} from '@/modules/camera/hooks/useScanLicencePlate'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'

const LicencePlateCameraComp = () => {
  const ref = useRef<Camera>(null)
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off)
  const { width } = useWindowDimensions()

  const { top } = useSafeAreaInsets()

  const [generatedEcv, setGeneratedEcv] = useState('')

  useCameraPermission({ autoAsk: true })

  const { scanLicencePlate, loading, checkEcv } = useScanLicencePlate()

  const takePicture = async () => {
    if (generatedEcv) {
      await checkEcv(generatedEcv)

      return
    }

    const date = new Date()

    const photo = await ref.current?.takePictureAsync()

    if (!photo) return

    const ecv = await scanLicencePlate(photo)
    setGeneratedEcv(ecv)
    console.log('Time function took in seconds:', (Date.now() - date.getTime()) / 1000)
  }

  return (
    <ScreenView title="Skenuj EČV" className="h-full flex-1 flex-col">
      <Camera ratio="16:9" ref={ref} style={{ height: (width * 16) / 9 }} flashMode={flashMode}>
        <View className="h-full w-full">
          <View
            style={{ paddingTop: top, height: HEADER_WITH_PADDING }}
            className="items-center justify-start bg-dark/80"
          />
          <View style={{ height: CROPPED_PHOTO_HEIGHT }} className="items-center" />
          <View className="flex-1 items-center bg-dark/80 bg-opacity-20" />
        </View>
      </Camera>

      <LicencePlateCameraBottomSheet
        isLoading={loading}
        flashMode={flashMode}
        toggleFlashlight={() =>
          // flash doesn't get triggered when value of FlashMode is "on"... the "torch" value works fine
          setFlashMode((prev) => (prev === FlashMode.off ? FlashMode.torch : FlashMode.off))
        }
        licencePlate={generatedEcv}
        takePicture={takePicture}
        onChangeLicencePlate={(ecv) => setGeneratedEcv(ecv)}
      />
    </ScreenView>
  )
}

export default LicencePlateCameraComp
