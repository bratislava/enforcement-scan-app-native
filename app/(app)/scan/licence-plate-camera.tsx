import { router } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Camera } from 'react-native-vision-camera'

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
import { TextData } from '@/modules/camera/types'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { addTextToImage } from '@/utils/addTextToImage'
import { cn } from '@/utils/cn'

let plates: string[] = []

const LicencePlateCameraComp = () => {
  const { t } = useTranslation()
  const ref = useRef<Camera>(null)
  const [torch, setTorch] = useState<TorchState>('off')
  const [isLoading, setIsLoading] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResultEnum | null>(null)
  const [isManual, setIsManual] = useState(false)

  const { top } = useSafeAreaInsets()

  const generatedEcv = useOffenceStoreContext((state) => state.ecv)
  const roleKey = useOffenceStoreContext((state) => state.roleKey)
  const role = getRoleByKey(roleKey)
  const { setOffenceState } = useSetOffenceState()

  useCameraPermission({ autoAsk: true })

  const { scanLicencePlate, checkEcv } = useScanLicencePlate()

  const onCheckEcv = useCallback(
    async (ecv: string) => {
      try {
        const newScanResult = await checkEcv(ecv, isManual)

        if (newScanResult === ScanReasonEnum.Other) {
          return router.navigate('/offence')
        }
        // if (newScanResult !== ScanResultEnum.NoViolation)
        //   return router.navigate({
        //     pathname: '/scan/scan-result',
        //     params: { scanResult: newScanResult },
        //   })

        return newScanResult
      } catch {
        return null
      }
    },
    [checkEcv, isManual],
  )

  const takeLicencePlatePicture = useCallback(async () => {
    if (!ref.current) return

    const ecvPhoto = await ref.current.takePhoto()
    const imageWithTimestampUri = await addTextToImage(new Date().toLocaleString(), ecvPhoto?.path)

    setOffenceState({ photos: [imageWithTimestampUri] })
  }, [ref, setOffenceState])

  const onFrameCapture = useCallback(
    async (frame: TextData) => {
      if (generatedEcv) return

      const ecv = scanLicencePlate(frame)

      if (ecv) {
        if (!plates.includes(ecv)) {
          plates.push(ecv)
          if (plates.length > 5) plates.shift()

          return
        }

        setIsLoading(true)
        setScanResult(null)

        setOffenceState({ ecv })
        setIsManual(false)
        takeLicencePlatePicture()

        const newScanResult = await onCheckEcv(ecv)

        if (newScanResult && role?.actions.scanCheck) {
          setScanResult(newScanResult)
        }

        setIsLoading(false)
      }
    },
    [
      generatedEcv,
      onCheckEcv,
      role?.actions.scanCheck,
      scanLicencePlate,
      setOffenceState,
      takeLicencePlatePicture,
    ],
  )

  const onContinue = async () => {
    setIsLoading(true)
    if (scanResult && role?.actions.scanCheck) {
      router.navigate('/offence')

      return
    }

    setScanResult(null)

    if (generatedEcv) {
      const result = await onCheckEcv(generatedEcv)

      if (result) {
        if (role?.actions.scanCheck) {
          setScanResult(result)
        } else {
          router.push('/offence')
        }
      }
    }

    setIsLoading(false)
  }

  const onChangeLicencePlate = (ecv: string) => {
    if (scanResult) {
      setScanResult(null)
    }

    plates = []

    setIsManual(true)
    setOffenceState({ ecv: ecv.toUpperCase() })
  }

  const backgroundClassName = cn('items-center bg-dark/75', {
    'bg-green/75': scanResult === ScanResultEnum.NoViolation,
    'bg-negative/75': scanResult === ScanResultEnum.PaasParkingViolation,
    'bg-warning/75': scanResult === ScanResultEnum.PaasParkingViolationDuplicity,
  })

  return (
    <ScreenView title={t('scanLicencePlate.title')} className="h-full">
      <View className="relative">
        <OcrCamera ref={ref} torch={torch} onFrameCapture={onFrameCapture} />

        <View className="absolute h-full w-full">
          <View
            style={{ paddingTop: top, height: HEADER_WITH_PADDING }}
            className={cn('justify-start', backgroundClassName)}
          />
          <View style={{ height: CROPPED_AREA_HEIGHT }} className="items-center" />
          <View className={cn('flex-1 ', backgroundClassName)} />
        </View>
      </View>

      <LicencePlateCameraBottomSheet
        isLoading={isLoading}
        torch={torch}
        setTorch={setTorch}
        licencePlate={generatedEcv}
        onContinue={onContinue}
        onChangeLicencePlate={onChangeLicencePlate}
      />
    </ScreenView>
  )
}

export default LicencePlateCameraComp
