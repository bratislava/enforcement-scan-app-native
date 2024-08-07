import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image } from 'react-native'
import { Camera } from 'react-native-vision-camera'

import { TorchState } from '@/components/camera/FlashlightBottomSheetAttachment'
import FullScreenCamera from '@/components/camera/FullScreenCamera'
import ZoneCameraBottomSheet from '@/components/camera/ZoneCameraBottomSheet'
import ScreenView from '@/components/screen-layout/ScreenView'
import { clientApi } from '@/modules/backend/client-api'
import { getFavouritePhotosOptions } from '@/modules/backend/constants/queryOptions'
import { useLocation } from '@/modules/map/hooks/useLocation'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { addGpsMetadataToImage } from '@/utils/addGpsMetadataToImage'
import { addTextToImage } from '@/utils/addTextToImage'
import { coordsToString } from '@/utils/coordsToString'
import { createUrlFromImageObject } from '@/utils/createUrlFromImageObject'

const AppRoute = () => {
  const { t } = useTranslation()
  const { setOffenceState } = useSetOffenceState()
  const zonePhoto = useOffenceStoreContext((state) => state.zonePhoto)

  const ref = useRef<Camera>(null)
  const [torch, setTorch] = useState<TorchState>('off')
  const [loading, setLoading] = useState(false)

  const queryClient = useQueryClient()

  const [currentLocation] = useLocation()

  const createPhotoMutation = useMutation({
    mutationFn: ({ file, tag }: { file: File; tag: string }) =>
      clientApi.scanControllerCreateFavouritePhoto(file, tag),
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: getFavouritePhotosOptions().queryKey })
    },
  })

  const takePicture = async (tag: string) => {
    setLoading(true)

    const { coords } = currentLocation ?? {}
    const locationString = coords ? `${coordsToString(coords.latitude, coords.longitude)}; ` : ''

    const capturedPhoto = await ref.current?.takePhoto()

    const imageWithTimestampUri = await addTextToImage({
      text: `${locationString}${new Date().toLocaleString()}`,
      imagePath: capturedPhoto?.path,
    })

    const imageWithMetadataUri = coords
      ? await addGpsMetadataToImage({
          imagePath: imageWithTimestampUri,
          lat: coords.latitude,
          long: coords.longitude,
        })
      : imageWithTimestampUri

    if (!imageWithTimestampUri) {
      setLoading(false)

      return
    }

    try {
      const photoResponse = await createPhotoMutation.mutateAsync({
        file: {
          uri: imageWithMetadataUri,
          type: 'image/jpeg',
          name: imageWithMetadataUri.split('/').pop()!,
        } as unknown as File,
        tag,
      })

      setOffenceState({ zonePhoto: photoResponse.data })
    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }

  console.log(zonePhoto ? createUrlFromImageObject(zonePhoto) : undefined)

  return (
    <ScreenView hasBackButton title={t('zone.zonePicture')} className="h-full">
      {zonePhoto ? (
        <Image
          source={{ uri: createUrlFromImageObject(zonePhoto) }}
          resizeMode="contain"
          style={{ flex: 1 }}
        />
      ) : (
        <FullScreenCamera ref={ref} torch={torch} />
      )}

      <ZoneCameraBottomSheet
        hasPhoto={!!zonePhoto}
        torch={torch}
        isLoading={loading}
        takePicture={takePicture}
        setTorch={setTorch}
      />
    </ScreenView>
  )
}

export default AppRoute
