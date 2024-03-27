import TextRecognition, { TextRecognitionResult } from '@react-native-ml-kit/text-recognition'
import { useMutation } from '@tanstack/react-query'
import { CameraCapturedPicture } from 'expo-camera'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import * as Location from 'expo-location'
import { useCallback, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { clientApi } from '@/modules/backend/client-api'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { RequestCreateOrUpdateScanDto } from '@/modules/backend/openapi-generated'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'

export const HEADER_WITH_PADDING = 100
export const CROPPED_PHOTO_HEIGHT = 150

const biggestText = (ocr: TextRecognitionResult) => {
  const ocrs = ocr?.blocks
    .filter(({ frame }) => !!frame)
    .map((block) => ({
      ...block,
      surfaceArea: block.frame ? block.frame.width * block.frame.height : 0,
    }))

  const numbers = ocrs.map(({ surfaceArea }) => surfaceArea)

  if (!Array.isArray(numbers) || numbers.length === 0) return ''

  const index = numbers.indexOf(Math.max(...numbers))

  return ocrs[index].text
}

export const useScanLicencePlate = () => {
  const [loading, setLoading] = useState(false)
  const { width } = useWindowDimensions()
  const { top } = useSafeAreaInsets()

  const [lastScanId, setLastScanId] = useState<string>()

  const roleKey = useOffenceStoreContext((state) => state.roleKey)
  const udrId = useOffenceStoreContext((state) => state.zone?.udrId)

  const createScanMutation = useMutation({
    mutationFn: (bodyInner: RequestCreateOrUpdateScanDto) =>
      clientApi.scanControllerCreateOrUpdateScanEcv(bodyInner),
  })
  /**
   * Get the originY and height of the cropped part for the photo from the camera
   */
  const getPhotoOriginY = useCallback(
    (photoHeight: number) => {
      const cameraHeight = (width * 16) / 9
      const topHeightRatio = (top + HEADER_WITH_PADDING) / cameraHeight
      const croppedHeightRatio = CROPPED_PHOTO_HEIGHT / cameraHeight

      return {
        originY: photoHeight * topHeightRatio,
        height: photoHeight * croppedHeightRatio,
      }
    },
    [width, top],
  )

  const scanLicencePlate = useCallback(
    async (photo: CameraCapturedPicture) => {
      try {
        setLoading(true)

        const { originY, height } = getPhotoOriginY(photo.height)

        const croppedPhoto = await manipulateAsync(
          photo.uri,
          [
            {
              crop: { originX: 0, originY, width: photo.width, height },
            },
          ],
          {
            compress: 0.5,
            format: SaveFormat.JPEG,
          },
        )
        const newOcr = await TextRecognition.recognize(croppedPhoto.uri)

        if (newOcr) {
          const ecv = biggestText(newOcr)
            .replaceAll(/(\r\n|\n|\r|\s)/gm, '')
            .replaceAll(/[^\dA-Z]/g, '')

          const role = getRoleByKey(roleKey!)!

          const location = await Location.getLastKnownPositionAsync()

          if (!location) return ''

          const res = await createScanMutation.mutateAsync({
            uuid: lastScanId,
            ecv,
            scanReason: role.scanReason,
            udr: udrId,
            // scanReason: ScanReasonEnum.Other,
            lat: location.coords.latitude.toString(),
            long: location.coords.longitude.toString(),
            ecvUpdatedManually: false,
            streetName: '',
          })

          if (res.data?.id) {
            setLastScanId(res.data.id.toString())
          }
        }
      } catch (error) {
        console.error('Error scanning licence plate', error)
      } finally {
        setLoading(false)
      }

      return ''
    },
    [createScanMutation, getPhotoOriginY, lastScanId, roleKey, udrId],
  )

  return { loading, scanLicencePlate }
}
