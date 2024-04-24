import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image } from 'react-native'
import { Camera } from 'react-native-vision-camera'

import CameraBottomSheet from '@/components/camera/CameraBottomSheet'
import { TorchState } from '@/components/camera/FlashlightBottomSheetAttachment'
import FullScreenCamera from '@/components/camera/FullScreenCamera'
import ScreenView from '@/components/screen-layout/ScreenView'
import { clientApi } from '@/modules/backend/client-api'
import { getFavouritePhotosOptions } from '@/modules/backend/constants/queryParams'
import { getPhotoUri } from '@/modules/camera/utils/getPhotoUri'
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
  const [torch, setTorch] = useState<TorchState>('off')
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
    const capturedPhoto = await ref.current?.takePhoto()

    const photoUri = getPhotoUri(capturedPhoto)

    if (!photoUri) {
      setLoading(false)

      return
    }

    try {
      const photoResponse = await createPhotoMutation.mutateAsync({
        file: {
          uri: photoUri,
          type: 'image/jpeg',
          name: photoUri.split('/').pop()!,
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
        <FullScreenCamera ref={ref} torch={torch} />
      )}

      <CameraBottomSheet
        hasPhoto={!!zonePhoto}
        retakePicture={() => setOffenceState({ zonePhoto: undefined })}
        selectPicture={() => router.push('/scan/licence-plate-camera')}
        torch={torch}
        isLoading={loading}
        takePicture={takePicture}
        setTorch={setTorch}
      />
    </ScreenView>
  )
}

export default AppRoute
