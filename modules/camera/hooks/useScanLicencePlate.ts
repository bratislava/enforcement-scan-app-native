import { useMutation } from '@tanstack/react-query'
import * as Location from 'expo-location'
import { useCallback } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TextDataMap } from 'react-native-vision-camera-v3-text-recognition'

import { clientApi } from '@/modules/backend/client-api'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { RequestCreateOrUpdateScanDto, ScanResultEnum } from '@/modules/backend/openapi-generated'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

export const HEADER_WITH_PADDING = 100
export const CROPPED_AREA_HEIGHT = 150
const SCAN_LICENCE_PLATE_BUFFER = 30

export const useScanLicencePlate = () => {
  const { top } = useSafeAreaInsets()
  const { height: screenHeight } = useWindowDimensions()

  const roleKey = useOffenceStoreContext((state) => state.roleKey)
  const role = getRoleByKey(roleKey)
  const { setOffenceState } = useSetOffenceState()
  const udrId = useOffenceStoreContext((state) => state.zone?.udrId)

  const createScanMutation = useMutation({
    mutationFn: (bodyInner: RequestCreateOrUpdateScanDto) =>
      clientApi.scanControllerCreateOrUpdateScanEcv(bodyInner),
  })

  /**
   * Checks the ECV with BE and returns the scan result
   */
  const checkEcv = async (ecv: string): Promise<ScanResultEnum | null> => {
    const location = await Location.getLastKnownPositionAsync()

    if (!(location && role)) return null

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
      setOffenceState({ scanUuid: res.data.uuid })

      return res.data.scanResult || null
    }

    return null
  }

  /**
   * Finds the biggest block of text in the frame and checks whether it meets the criteria for ECV
   */
  const scanLicencePlate = useCallback(
    (frameObject: TextDataMap, height: number) => {
      // translate cropped element size from window height into frame height
      const translateHeight = (heightToTranslate: number) =>
        (heightToTranslate / screenHeight) * height

      const topBackdropHeight = top + HEADER_WITH_PADDING
      const croppedAreaStart = translateHeight(topBackdropHeight - SCAN_LICENCE_PLATE_BUFFER)
      const croppedAreaEnd = translateHeight(
        topBackdropHeight + CROPPED_AREA_HEIGHT + SCAN_LICENCE_PLATE_BUFFER,
      )

      const frameArray = Object.values(frameObject)
        .filter(
          (block) =>
            block.blockText &&
            block.blockFrameLeft >= croppedAreaStart &&
            block.blockFrameRight <= croppedAreaEnd,
        )
        .map((block) => ({
          ...block,
          surfaceArea:
            (block.blockFrameBottom - block.blockFrameTop) *
            (block.blockFrameRight - block.blockFrameLeft),
        }))

      const numbers = frameArray.map(({ surfaceArea }) => surfaceArea)

      if (!Array.isArray(numbers) || numbers.length === 0) return ''

      const index = numbers.indexOf(Math.max(...numbers))

      const newEcv = frameArray[index].blockText
        .replaceAll(/(\r\n|\n|\r|\s)/gm, '')
        .replaceAll(/[^\dA-Z]/g, '')

      if (newEcv.length > 5 && newEcv.length < 13) {
        return newEcv
      }

      return ''
    },
    [screenHeight, top],
  )

  return { checkEcv, scanLicencePlate }
}
