import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'

import { MAX_PHOTOS } from '@/app/(app)/offence/photos'
import { clientApi } from '@/modules/backend/client-api'
import { RequestCreateOffenceDataDto } from '@/modules/backend/openapi-generated'
import { getPhotoUri } from '@/modules/camera/utils/getPhotoUri'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'

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
    ecvPhoto,
    zone,
    resolutionType,
  } = useOffenceStoreContext((state) => state)

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
    if (!(ecv && location && offenceType && scanUuid && photos.length === MAX_PHOTOS)) {
      onRouteToResult('error')

      return
    }

    try {
      const res = await createOffenceMutation.mutateAsync({
        lastScanUuid: scanUuid,
        data: {
          offenceType,
          objectiveResponsibility: isObjectiveResponsibility,
          lat: location.lat.toString(),
          long: location.long.toString(),
          zonePhotoId: zonePhoto?.id,
          // offence with objective responsibility does not allow to set resolution type
          resolutionType: isObjectiveResponsibility ? undefined : resolutionType,
          udr: zone?.udrId,
          vehicleId,
        },
        // Axios throws Network Error if the file is fetched and sent with `new File()`
        files: [...photos, ecvPhoto].filter(Boolean).map((photo) => {
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
  }

  return { onCreateOffence, isLoading: createOffenceMutation.isPending }
}
