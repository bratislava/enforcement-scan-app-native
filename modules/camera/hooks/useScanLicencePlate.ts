import TextRecognition, { TextRecognitionResult } from '@react-native-ml-kit/text-recognition'
import { useMutation } from '@tanstack/react-query'
import { CameraCapturedPicture } from 'expo-camera'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import { useCallback, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { clientApi } from '@/modules/backend/client-api'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import {
  RequestCreateOrUpdateScanDto,
  ScanReasonEnum,
  ScanResultEnum,
} from '@/modules/backend/openapi-generated'
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

  const roleKey = useOffenceStoreContext((state) => state.roleKey)
  const role = getRoleByKey(roleKey)

  const udrId = useOffenceStoreContext((state) => state.zone?.udrId)

  const createScanMutation = useMutation({
    mutationFn: (bodyInner: RequestCreateOrUpdateScanDto) =>
      clientApi.scanControllerCreateOrUpdateScanEcv(bodyInner),
  })

  const checkEcv = async (ecv: string) => {
    const location = await Location.getLastKnownPositionAsync()

    if (!(location && role)) return

    const res = await createScanMutation.mutateAsync({
      ecv,
      scanReason: role.scanReason,
      udr: udrId,
      lat: location.coords.latitude.toString(),
      long: location.coords.longitude.toString(),
      ecvUpdatedManually: false,
      streetName: 'auto',
    })

    if (res.data) {
      if (res.data.scanResult === ScanReasonEnum.Other) {
        router.push('/offence')
      } else
        router.push({
          pathname: '/scan/scan-result',
          // TODO: remove fixed value after BE adds violations
          params: { scanResult: ScanResultEnum.PaasParkingViolation || res.data.scanResult },
        })
    }
  }

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
          const ecv =
            biggestText(newOcr)
              .replaceAll(/(\r\n|\n|\r|\s)/gm, '')
              .replaceAll(/[^\dA-Z]/g, '') || 'BR222BB' // ECV is here for testing purposes

          setLoading(false)

          return ecv
        }
      } catch (error) {
        setLoading(false)
        console.error('Error scanning licence plate', error)
      }

      return ''
    },
    [getPhotoOriginY],
  )

  return { loading, checkEcv, scanLicencePlate }
}
