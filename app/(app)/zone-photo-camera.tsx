import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Camera, FlashMode } from 'expo-camera'
import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { Image, useWindowDimensions } from 'react-native'

import CameraBottomSheet from '@/components/camera/CameraBottomSheet'
import ScreenView from '@/components/screen-layout/ScreenView'
import { clientApi } from '@/modules/backend/client-api'
import { getFavoritePhotosOptions } from '@/modules/backend/constants/queryParams'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { createUrlFromImageObject } from '@/utils/createUrlFromImageObject'

const ASPECT_RATIO = 16 / 9

const AppRoute = () => {
  const setState = useSetOffenceState()
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
      await queryClient.invalidateQueries({ queryKey: getFavoritePhotosOptions().queryKey })
    },
  })

  const { width } = useWindowDimensions()

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

      setState({ zonePhoto: photoResponse.data })
    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }

  return (
    <ScreenView hasBackButton title="Zónová fotka" className="h-full flex-1 flex-col">
      {zonePhoto ? (
        <Image source={{ uri: createUrlFromImageObject(zonePhoto) }} style={{ flex: 1 }} />
      ) : (
        // height computation takes place for camera to not have disorted view and aspect ratio to be 16:9
        <Camera
          ratio="16:9"
          ref={ref}
          style={{ height: width * ASPECT_RATIO }}
          flashMode={flashMode}
        />
      )}

      <CameraBottomSheet
        hasPhoto={!!zonePhoto}
        retakePicture={() => setState({ zonePhoto: undefined })}
        selectPicture={() => router.push('/licence-plate-camera')}
        flashMode={flashMode}
        isLoading={loading}
        takePicture={takePicture}
        toggleFlashlight={() =>
          // flash doesn't get triggered when value of FlashMode is "on"... the "torch" value works fine
          setFlashMode(flashMode === FlashMode.torch ? FlashMode.off : FlashMode.torch)
        }
      />
    </ScreenView>
  )
}

export default AppRoute
