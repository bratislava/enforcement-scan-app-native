import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { Position } from 'react-native-image-marker'

import { MAX_PHOTOS } from '@/app/(app)/offence/photos'
import { clientApi } from '@/modules/backend/client-api'
import { RequestCreateOffenceDataDto } from '@/modules/backend/openapi-generated'
import { getPhotoUri } from '@/modules/camera/utils/getPhotoUri'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { addGpsMetadataToImage } from '@/utils/addGpsMetadataToImage'
import { addTextToImage } from '@/utils/addTextToImage'
import { coordsToString } from '@/utils/coordsToString'

const onRouteToResult = (offenceResult: 'success' | 'error') => {
  router.push({
    pathname: 'offence/result',
    params: {
      offenceResult,
    },
  })
}

export const useCreateOffence = () => {
  const {
    offenceType,
    isObjectiveResponsibility,
    scanData,
    location,
    ecv,
    zonePhoto,
    vehicleId,
    photos,
    zone,
    resolutionType,
    offenceDate,
  } = useOffenceStoreContext((state) => state)

  const createOffenceMutation = useMutation({
    mutationFn: async () => {
      if (!(ecv && location && offenceType && scanData?.uuid && photos.length >= MAX_PHOTOS)) {
        onRouteToResult('error')

        throw new Error('Missing required data')
      }

      const photosWithLocation = await Promise.all(
        photos.map(async (photo) =>
          addTextToImage({
            text: coordsToString(location.lat, location.long),
            imagePath: photo,
            position: Position.topLeft,
          }),
        ),
      )

      const photosWithLocationMetadata = await Promise.all(
        photosWithLocation.map(async (photo) =>
          addGpsMetadataToImage({
            imagePath: photo,
            lat: location.lat,
            long: location.long,
          }),
        ),
      )

      const data: RequestCreateOffenceDataDto = {
        createdAt: offenceDate?.toISOString(),
        offenceType,
        objectiveResponsibility: isObjectiveResponsibility,
        lat: location.lat,
        long: location.long,
        zoneSignPhotoId: zonePhoto?.id,
        // offence with objective responsibility does not allow to set resolution type
        resolutionType: isObjectiveResponsibility ? undefined : resolutionType,
        udr: zone?.udrId,
        vehicleId,
      }

      return clientApi.scanControllerCreateOffence(
        scanData.uuid,
        JSON.stringify(data),
        // Axios throws Network Error if the file is fetched and sent with `new File()`
        photosWithLocationMetadata.map((photoPath) => {
          const photoUri = getPhotoUri(photoPath)

          return {
            uri: photoUri,
            name: photoPath.split('/').pop() || '',
            type: 'image/jpeg',
          } as unknown as File
        }),
      )
    },
  })

  const onCreateOffence = useCallback(async () => {
    if (createOffenceMutation.isPending) {
      return
    }

    try {
      const res = await createOffenceMutation.mutateAsync()

      onRouteToResult(res.data.id ? 'success' : 'error')
    } catch (error) {
      onRouteToResult('error')
    }
  }, [createOffenceMutation])

  return { onCreateOffence, isLoading: createOffenceMutation.isPending }
}
