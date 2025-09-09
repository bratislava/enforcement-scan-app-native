import { useMutation } from '@tanstack/react-query'
import * as Application from 'expo-application'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import { useCallback } from 'react'

import { APP_VERSION } from '@/components/info/AppVersion'
import { clientApi } from '@/modules/backend/client-api'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { ScanReasonEnum } from '@/modules/backend/openapi-generated'
import { BlockData, TextData } from '@/modules/camera/types'
import { correctLicencePlate, ECV_FORMAT_REGEX } from '@/modules/camera/utils/correctLicencePlate'
import { getCurrentPositionAsync } from '@/modules/map/utils/getCurrentPositionAsync'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

export const HEADER_WITH_PADDING = 100
export const CROPPED_AREA_HEIGHT = 150

const removeSpecialCharacters = (text: string) =>
  text
    .toUpperCase()
    .replaceAll('|', 'I')
    .replaceAll(/[^\dA-Z]/g, '')

export const useScanLicencePlate = () => {
  const roleKey = useOffenceStoreContext((state) => state.roleKey)
  const role = getRoleByKey(roleKey)
  const { setOffenceState } = useSetOffenceState()
  const zone = useOffenceStoreContext((state) => state.zone)
  const ecvUpdatedManually = useOffenceStoreContext((state) => state.ecvUpdatedManually)

  /**
   * Checks the ECV with BE and returns the scan result
   */
  const createScanMutation = useMutation({
    mutationFn: async ({ ecv }: { ecv: string }) => {
      const location = await getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      })

      if (!(location && role)) return

      const res = await clientApi.scanControllerCreateOrUpdateScanEcv({
        ecv: ecv.toUpperCase(),
        scanReason: role.scanReason,
        udr: zone?.udrId,
        lat: location.coords.latitude,
        long: location.coords.longitude,
        ecvUpdatedManually: !!ecvUpdatedManually,
        streetName: 'auto',
        areaCodes: zone?.odpRpk ? zone?.odpRpk.replaceAll(' ', '').split(',') : undefined,
        udrGlobalId: zone?.udrUuid,
        district: zone?.cityDistrict,
        areaName: zone?.name,
        mobileAppVersion: APP_VERSION,
        deviceId: Application.getAndroidId(),
      })

      if (res.data) {
        setOffenceState({
          scanData: res.data,
          location: { lat: location.coords.latitude, long: location.coords.longitude },
        })

        if (res.data.scanResult === ScanReasonEnum.Other) {
          router.push('/offence')
        }

        return
      }

      setOffenceState({ scanData: undefined })
    },
  })

  /**
   * Finds the biggest block of text in the frame and checks whether it meets the criteria for ECV
   */
  const scanLicencePlate = useCallback((frameObject?: TextData) => {
    if (!frameObject?.blocks) return ''

    const extractTextAndArea = (block: BlockData) => {
      const blockText =
        block.lines
          .map((line) => removeSpecialCharacters(line.lineText))
          .find((text) => ECV_FORMAT_REGEX.test(text) || text.length === 7) || ''

      const surfaceArea = block.blockFrame.width * block.blockFrame.height

      return { text: blockText, surfaceArea }
    }

    // Filter and map the text blocks within the cropped area
    const frameBlocks = frameObject.blocks?.map(extractTextAndArea)
    // Return an empty string if no valid blocks are found
    if (frameBlocks?.length === 0) return ''

    // Get the surface areas of the filtered blocks
    const surfaceAreas = frameBlocks.map(({ surfaceArea }) => surfaceArea)

    const maxIndex = surfaceAreas.indexOf(Math.max(...surfaceAreas))
    const newEcv = frameBlocks[maxIndex].text

    if (newEcv.length > 6 && newEcv.length < 10) {
      return ECV_FORMAT_REGEX.test(newEcv) ? correctLicencePlate(newEcv) : newEcv
    }

    return ''
  }, [])

  return {
    checkEcv: createScanMutation.mutateAsync,
    scanLicencePlate,
    isLoading: createScanMutation.isPending,
  }
}
