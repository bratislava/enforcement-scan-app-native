import { Camera, CameraCapturedPicture, FlashMode } from 'expo-camera'
import { router, useLocalSearchParams } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image } from 'react-native'

import CameraBottomSheet from '@/components/camera/CameraBottomSheet'
import FullScreenCamera from '@/components/camera/FullScreenCamera'
import ScreenView from '@/components/screen-layout/ScreenView'
import IconButton from '@/components/shared/IconButton'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const AppRoute = () => {
  const { t } = useTranslation()

  const { index } = useLocalSearchParams<{ index: string }>()
  const photoIndex = Number(index)

  const { setOffenceState } = useSetOffenceState()
  const photos = useOffenceStoreContext((state) => state.photos)

  const ref = useRef<Camera>(null)

  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(photos[photoIndex] || null)
  const [isRetaking, setIsRetaking] = useState(false)
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off)
  const [loading, setLoading] = useState(false)

  useCameraPermission({ autoAsk: true })

  const takePicture = async () => {
    setLoading(true)
    const capturedPhoto = await ref.current?.takePictureAsync()

    if (!capturedPhoto) {
      setLoading(false)

      return
    }

    setPhoto(capturedPhoto)

    setLoading(false)
  }

  const selectPicture = () => {
    if (!(photo && isRetaking)) return

    const newPhotos = [...photos]
    newPhotos.splice(photoIndex, 1, photo)

    setOffenceState({ photos: newPhotos })
    router.back()
  }

  const retakePicture = () => {
    setIsRetaking(true)
    setPhoto(null)
  }

  return (
    <ScreenView
      hasBackButton
      title={t('offence.picture.detail.title')}
      options={{
        headerRight: () => (
          <IconButton
            accessibilityLabel={t('offence.picture.detail.retake')}
            name="cached"
            onPress={retakePicture}
          />
        ),
      }}
      className="h-full"
    >
      {photo ? (
        <Image source={{ uri: photo?.uri || photos[photoIndex].uri }} style={{ flex: 1 }} />
      ) : (
        <FullScreenCamera ref={ref} flashMode={flashMode} />
      )}

      {isRetaking ? (
        <CameraBottomSheet
          hasPhoto={!!photo}
          flashMode={flashMode}
          isLoading={loading}
          takePicture={takePicture}
          selectPicture={selectPicture}
          retakePicture={retakePicture}
          setFlashMode={setFlashMode}
        />
      ) : null}
    </ScreenView>
  )
}

export default AppRoute
