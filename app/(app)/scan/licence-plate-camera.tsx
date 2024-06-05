import { router } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Camera } from 'react-native-vision-camera'
import { Text } from 'react-native-vision-camera-v3-text-recognition/lib/typescript/src/types'

import { TorchState } from '@/components/camera/FlashlightBottomSheetAttachment'
import LicencePlateCameraBottomSheet from '@/components/camera/LicencePlateCameraBottomSheet'
import OcrCamera from '@/components/camera/OcrCamera'
import ScreenView from '@/components/screen-layout/ScreenView'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { ScanReasonEnum, ScanResultEnum } from '@/modules/backend/openapi-generated'
import {
  CROPPED_AREA_HEIGHT,
  HEADER_WITH_PADDING,
  useScanLicencePlate,
} from '@/modules/camera/hooks/useScanLicencePlate'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { cn } from '@/utils/cn'

const LicencePlateCameraComp = () => {
  const { t } = useTranslation()
  const ref = useRef<Camera>(null)
  const [torch, setTorch] = useState<TorchState>('off')
  const [isLoading, setIsLoading] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResultEnum | null>(null)

  const { top } = useSafeAreaInsets()

  const generatedEcv = useOffenceStoreContext((state) => state.ecv)
  const licencePlatePicture = useOffenceStoreContext((state) => state.ecvPhoto)
  const roleKey = useOffenceStoreContext((state) => state.roleKey)
  const role = getRoleByKey(roleKey)
  const { setOffenceState } = useSetOffenceState()

  useCameraPermission({ autoAsk: true })

  const { scanLicencePlate, checkEcv } = useScanLicencePlate()

  const onCheckEcv = useCallback(
    async (ecv: string, isManual?: boolean) => {
      const newScanResult = await checkEcv(ecv, isManual)

      if (newScanResult === ScanReasonEnum.Other) {
        return router.push('/offence')
      }
      if (newScanResult !== ScanResultEnum.NoViolation)
        return router.push({
          pathname: '/scan/scan-result',
          params: { scanResult: newScanResult },
        })

      return newScanResult
    },
    [checkEcv],
  )

  const takeLicencePlatePicture = useCallback(async () => {
    if (!ref.current) return

    const ecvPhoto = await ref.current.takePhoto()
    setOffenceState({ ecvPhoto })
  }, [ref, setOffenceState])

  const onFrameCapture = useCallback(
    async (frame: Text, height: number) => {
      const ecv = scanLicencePlate(frame, height)

      if (ecv && !generatedEcv) {
        setIsLoading(true)
        setScanResult(null)

        setOffenceState({ ecv })

        const newScanResult = await onCheckEcv(ecv)

        if (newScanResult && role?.actions.scanCheck) {
          setScanResult(newScanResult)
        }

        setIsLoading(false)
      }
    },
    [generatedEcv, onCheckEcv, role?.actions.scanCheck, scanLicencePlate, setOffenceState],
  )

  useEffect(() => {
    if (generatedEcv && !licencePlatePicture) takeLicencePlatePicture()
  }, [licencePlatePicture, generatedEcv, takeLicencePlatePicture])

  const onContinue = async () => {
    setIsLoading(true)

    if (generatedEcv) {
      const result = await onCheckEcv(generatedEcv, true)

      if (result) router.push('/offence')
    }

    setIsLoading(false)
  }

  return (
    <ScreenView title={t('scanLicencePlate.title')} className="h-full">
      <View className="relative">
        <OcrCamera ref={ref} torch={torch} onFrameCapture={onFrameCapture} />

        <View className="absolute h-full w-full">
          <View
            style={{ paddingTop: top, height: HEADER_WITH_PADDING }}
            className={cn('items-center justify-start bg-dark/80', {
              'bg-green/80': scanResult === ScanResultEnum.NoViolation,
            })}
          />
          <View style={{ height: CROPPED_AREA_HEIGHT }} className="items-center" />
          <View
            className={cn('flex-1 items-center bg-dark/80 bg-opacity-20', {
              'bg-green/80': scanResult === ScanResultEnum.NoViolation,
            })}
          />
        </View>
      </View>

      <LicencePlateCameraBottomSheet
        isLoading={isLoading}
        torch={torch}
        setTorch={setTorch}
        licencePlate={generatedEcv}
        onContinue={onContinue}
        onChangeLicencePlate={(ecv) => {
          if (scanResult) {
            setScanResult(null)
          }

          setOffenceState({ ecv: ecv.toUpperCase(), ecvPhoto: undefined })
        }}
      />
    </ScreenView>
  )
}

export default LicencePlateCameraComp
