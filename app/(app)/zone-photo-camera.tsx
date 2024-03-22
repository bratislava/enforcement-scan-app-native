import { Camera, FlashMode } from 'expo-camera'
import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { Image, useWindowDimensions } from 'react-native'

import CameraBottomSheet from '@/components/camera/CameraBottomSheet'
import ScreenView from '@/components/screen-layout/ScreenView'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const AppRoute = () => {
  const setState = useSetOffenceState()
  const photo = useOffenceStoreContext((state) => state.zonePhoto)

  const ref = useRef<Camera>(null)
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off)
  const [loading, setLoading] = useState(false)

  const { width } = useWindowDimensions()

  useCameraPermission({ autoAsk: true })

  const takePicture = async () => {
    setLoading(true)
    const capturedPhoto = await ref.current?.takePictureAsync()
    setState({ zonePhoto: capturedPhoto?.uri })
    setLoading(false)
  }

  return (
    <ScreenView hasBackButton title="Zónová fotka" className="h-full flex-1 flex-col">
      {photo ? (
        <Image source={{ uri: photo }} style={{ flex: 1 }} />
      ) : (
        <Camera ratio="16:9" ref={ref} style={{ height: (width * 16) / 9 }} flashMode={flashMode} />
      )}

      <CameraBottomSheet
        hasPhoto={!!photo}
        retakePicture={() => setState({ zonePhoto: undefined })}
        selectPicture={() => router.push('/camera')}
        flashMode={flashMode}
        isLoading={loading}
        takePicture={takePicture}
        toggleFlashlight={() =>
          setFlashMode(flashMode === FlashMode.torch ? FlashMode.off : FlashMode.torch)
        }
      />
    </ScreenView>
  )
}

export default AppRoute
