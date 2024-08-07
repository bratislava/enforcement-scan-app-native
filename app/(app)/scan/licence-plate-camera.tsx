import { router, usePathname } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Camera } from 'react-native-vision-camera'

import { TorchState } from '@/components/camera/FlashlightBottomSheetAttachment'
import LicencePlateCameraBottomSheet from '@/components/camera/LicencePlateCameraBottomSheet'
import OcrCamera from '@/components/camera/OcrCamera'
import ScreenView from '@/components/screen-layout/ScreenView'
import DismissKeyboard from '@/components/shared/DissmissKeyboard'
import IconButton from '@/components/shared/IconButton'
import { ScanResultEnum } from '@/modules/backend/openapi-generated'
import {
  CROPPED_AREA_HEIGHT,
  HEADER_WITH_PADDING,
  useScanLicencePlate,
} from '@/modules/camera/hooks/useScanLicencePlate'
import { TextData } from '@/modules/camera/types'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { addTextToImage } from '@/utils/addTextToImage'
import { cn } from '@/utils/cn'

let plates: string[] = []

const LicencePlateCameraComp = () => {
  const { t } = useTranslation()
  const ref = useRef<Camera>(null)
  const [torch, setTorch] = useState<TorchState>('off')
  const [isManual, setIsManual] = useState(false)

  const { top } = useSafeAreaInsets()

  const pathname = usePathname()

  const scanResult = useOffenceStoreContext((state) => state.scanResult)
  const generatedEcv = useOffenceStoreContext((state) => state.ecv)

  const { setOffenceState } = useSetOffenceState()

  const { scanLicencePlate, checkEcv, isLoading } = useScanLicencePlate()

  const takeLicencePlatePicture = useCallback(async () => {
    if (!ref.current) return

    try {
      const ecvPhoto = await ref.current?.takePhoto()
      const imageWithTimestampUri = await addTextToImage({
        text: new Date().toLocaleString(),
        imagePath: ecvPhoto?.path,
      })

      setOffenceState({ photos: [imageWithTimestampUri] })
    } catch {
      // TODO: Debug why this occurs twice... error happens when the camera is closed and picture is taken, needs further investigation
      console.log('error')
    }
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

        setOffenceState({ ecv })
        takeLicencePlatePicture()

        await checkEcv(ecv, isManual)
      }
    },
    [generatedEcv, checkEcv, isManual, scanLicencePlate, setOffenceState, takeLicencePlatePicture],
  )

  const onContinue = async () => {
    if (scanResult && scanResult !== ScanResultEnum.Other) {
      router.navigate('/offence')

      return
    }

    setOffenceState({ scanResult: undefined })

    if (generatedEcv) {
      await checkEcv(generatedEcv, isManual)
    }
  }

  const onChangeLicencePlate = useCallback(
    (ecv: string) => {
      plates = []

      setIsManual(!!ecv)
      setOffenceState({ scanResult: undefined, ecv })
    },
    [setOffenceState],
  )

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (scanResult === ScanResultEnum.NoViolation && pathname === '/scan/licence-plate-camera') {
      timeout = setTimeout(() => {
        onChangeLicencePlate('')
      }, 2000)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [scanResult, onChangeLicencePlate, pathname])

  const backgroundClassName = cn('items-center bg-dark/75', {
    'bg-green/75': scanResult === ScanResultEnum.NoViolation,
    'bg-negative/75': scanResult === ScanResultEnum.PaasParkingViolation,
    'bg-warning/75': scanResult === ScanResultEnum.PaasParkingViolationDuplicity,
  })

  return (
    <DismissKeyboard>
      <ScreenView
        title={t('scanLicencePlate.title')}
        options={{
          headerRight: () => (
            <IconButton
              name="home"
              accessibilityLabel={t('offenceResult.home')}
              onPress={() => router.navigate('/')}
            />
          ),
        }}
        className="h-full"
      >
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
    </DismissKeyboard>
  )
}

export default LicencePlateCameraComp
