import { Camera, FlashMode } from 'expo-camera'
import { Redirect } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import FullScreenCamera from '@/components/camera/FullScreenCamera'
import PhotosBottomSheet from '@/components/camera/PhotosBottomSheet'
import ScreenView from '@/components/screen-layout/ScreenView'
import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

export const MAX_PHOTOS = 5

const AppRoute = () => {
  const { t } = useTranslation()
  const snackbar = useSnackbar()
  useCameraPermission({ autoAsk: true })

  const { setOffenceState } = useSetOffenceState()
  const photos = useOffenceStoreContext((state) => state.photos)

  const ref = useRef<Camera>(null)
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off)
  const [loading, setLoading] = useState(false)

  const takePicture = async () => {
    setLoading(true)
    const capturedPhoto = await ref.current?.takePictureAsync()

    if (!capturedPhoto) {
      snackbar.show(t('offenceCamera.error'), {
        variant: 'danger',
      })

      setLoading(false)

      return
    }

    const newPhotos = [...photos, capturedPhoto]

    setOffenceState({ photos: newPhotos })

    setLoading(false)
  }

  if (photos.length >= MAX_PHOTOS) {
    return (
      <ScreenView title={t('offenceCamera.title')}>
        <Redirect href="/offence/photos/library" />
      </ScreenView>
    )
  }

  return (
    <ScreenView
      hasBackButton
      title={t('offenceCamera.titleWithCount', {
        currentCount: photos.length + 1,
        maxCount: MAX_PHOTOS,
      })}
      className="h-full"
    >
      <FullScreenCamera ref={ref} flashMode={flashMode} />

      <PhotosBottomSheet
        flashMode={flashMode}
        isLoading={loading}
        takePicture={takePicture}
        setFlashMode={setFlashMode}
      />
    </ScreenView>
  )
}

export default AppRoute
