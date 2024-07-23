import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'
import { Position } from 'react-native-image-marker'

import { MAX_PHOTOS } from '@/app/(app)/offence/photos'
import { clientApi } from '@/modules/backend/client-api'
import { RequestCreateOffenceDataDto } from '@/modules/backend/openapi-generated'
import { getPhotoUri } from '@/modules/camera/utils/getPhotoUri'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
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
    scanUuid,
    location,
    ecv,
    zonePhoto,
    vehicleId,
    photos,
    zone,
    resolutionType,
  } = useOffenceStoreContext((state) => state)

  const [isLoading, setLoading] = useState(false)

  const createOffenceMutation = useMutation({
    mutationFn: ({
      lastScanUuid,
      data,
      files,
    }: {
      lastScanUuid: string
      data: RequestCreateOffenceDataDto
      files: Array<File>
    }) => clientApi.scanControllerCreateOffence(lastScanUuid, data, files),
  })

  const onCreateOffence = async () => {
    setLoading(true)

    if (!(ecv && location && offenceType && scanUuid && photos.length >= MAX_PHOTOS)) {
      onRouteToResult('error')
      setLoading(false)

      return
    }

    const photosWithLocation = await Promise.all(
      photos.map(async (photo) =>
        addTextToImage(coordsToString(location.lat, location.long), photo, Position.bottomLeft),
      ),
    )

    try {
      const res = await createOffenceMutation.mutateAsync({
        lastScanUuid: scanUuid,
        data: {
          offenceType,
          objectiveResponsibility: isObjectiveResponsibility,
          lat: location.lat.toString(),
          long: location.long.toString(),
          favouritePhotoId: zonePhoto?.id,
          // offence with objective responsibility does not allow to set resolution type
          resolutionType: isObjectiveResponsibility ? undefined : resolutionType,
          udr: zone?.udrId,
          vehicleId,
        },
        // Axios throws Network Error if the file is fetched and sent with `new File()`
        files: photosWithLocation.map((photo) => {
          const photoUri = getPhotoUri(photo)

          return {
            uri: photoUri,
            type: 'image/jpeg',
            name: photoUri,
          }
        }) as unknown as Array<File>,
      })

      onRouteToResult(res.data.id ? 'success' : 'error')
    } catch (error) {
      onRouteToResult('error')
    }

    setLoading(false)
  }

  return { onCreateOffence, isLoading }
}
