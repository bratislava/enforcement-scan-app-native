import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Camera, FlashMode } from 'expo-camera'
import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image } from 'react-native'

import CameraBottomSheet from '@/components/camera/CameraBottomSheet'
import FullScreenCamera from '@/components/camera/FullScreenCamera'
import ScreenView from '@/components/screen-layout/ScreenView'
import { clientApi } from '@/modules/backend/client-api'
import { getFavouritePhotosOptions } from '@/modules/backend/constants/queryParams'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { createUrlFromImageObject } from '@/utils/createUrlFromImageObject'

const AppRoute = () => {
  const { t } = useTranslation()
  const { setOffenceState } = useSetOffenceState()
  const zonePhoto = useOffenceStoreContext((state) => state.zonePhoto)
  const udrUuid = useOffenceStoreContext((state) => state.zone?.udrUuid)

  const ref = useRef<Camera>(null)
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off)
  const [loading, setLoading] = useState(false)

  const queryClient = useQueryClient()

  const createPhotoMutation = useMutation({
    mutationFn: ({ file, tag }: { file: File; tag: string }) =>
      clientApi.scanControllerCreateFavouritePhoto(file, tag),
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: getFavouritePhotosOptions().queryKey })
    },
  })

  useCameraPermission({ autoAsk: true })

  const takePicture = async () => {
    setLoading(true)
    const capturedPhoto = await ref.current?.takePictureAsync()

    if (!capturedPhoto) {
      setLoading(false)

      return
    }

    try {
      const photoResponse = await createPhotoMutation.mutateAsync({
        file: {
          uri: capturedPhoto.uri,
          type: 'image/jpeg',
          name: capturedPhoto.uri.split('/').pop()!,
        } as unknown as File,
        tag: udrUuid!,
      })

      setOffenceState({ zonePhoto: photoResponse.data })
    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }

  return (
    <ScreenView hasBackButton title={t('zone.zonePicture')} className="h-full">
      {zonePhoto ? (
        <Image source={{ uri: createUrlFromImageObject(zonePhoto) }} style={{ flex: 1 }} />
      ) : (
        <FullScreenCamera ref={ref} flashMode={flashMode} />
      )}

      <CameraBottomSheet
        hasPhoto={!!zonePhoto}
        retakePicture={() => setOffenceState({ zonePhoto: undefined })}
        selectPicture={() => router.push('/scan/licence-plate-camera')}
        flashMode={flashMode}
        isLoading={loading}
        takePicture={takePicture}
        setFlashMode={setFlashMode}
      />
    </ScreenView>
  )
}

export default AppRoute
