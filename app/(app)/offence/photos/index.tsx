import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera } from 'react-native-vision-camera'

import FullScreenCamera from '@/components/camera/FullScreenCamera'
import PhotosBottomSheet from '@/components/camera/PhotosBottomSheet'
import ScreenView from '@/components/screen-layout/ScreenView'
import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import FlashlightContextProvider from '@/modules/camera/state/FlashlightContextProvider'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { addTextToImage } from '@/utils/addTextToImage'

export const MAX_PHOTOS = 5

const AppRoute = () => {
  const { t } = useTranslation()
  const snackbar = useSnackbar()

  const { setOffenceState } = useSetOffenceState()
  const photos = useOffenceStoreContext((state) => state.photos)

  const ref = useRef<Camera>(null)
  const [loading, setLoading] = useState(false)

  const takePicture = async () => {
    setLoading(true)
    const capturedPhoto = await ref.current?.takePhoto()
    const imageWithTimestampUri = await addTextToImage({
      text: new Date().toLocaleString(),
      imagePath: capturedPhoto?.path,
    })

    if (!imageWithTimestampUri) {
      snackbar.show(t('offenceCamera.error'), {
        variant: 'danger',
      })

      setLoading(false)

      return
    }

    const newPhotos = [...photos, imageWithTimestampUri]

    setOffenceState({ photos: newPhotos })

    setLoading(false)

    if (newPhotos.length >= MAX_PHOTOS) {
      router.back()
      router.navigate('/offence/photos/library')
    }
  }

  return (
    <FlashlightContextProvider>
      <ScreenView
        hasBackButton
        title={t('offenceCamera.titleWithCount', {
          currentCount: photos.length + 1,
          maxCount: MAX_PHOTOS,
        })}
        className="h-full"
      >
        <FullScreenCamera ref={ref} />

        <PhotosBottomSheet isLoading={loading} takePicture={takePicture} />
      </ScreenView>
    </FlashlightContextProvider>
  )
}

export default AppRoute
