import { router, usePathname } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Camera } from 'react-native-vision-camera'

import { LicencePlateCameraBackground } from '@/components/camera/LicencePlateCameraBackground'
import LicencePlateCameraBottomSheet from '@/components/camera/LicencePlateCameraBottomSheet'
import OcrCamera from '@/components/camera/OcrCamera'
import { HomeButton } from '@/components/navigation/HomeButton'
import ScreenView from '@/components/screen-layout/ScreenView'
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import { ScanResultEnum } from '@/modules/backend/openapi-generated'
import { useScanLicencePlate } from '@/modules/camera/hooks/useScanLicencePlate'
import FlashlightContextProvider from '@/modules/camera/state/FlashlightContextProvider'
import { TextData } from '@/modules/camera/types'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { addTextToImage } from '@/utils/addTextToImage'

const MAX_PLATE_HISTORY = 5
const REQUIRED_SCANS = 2

const LicencePlateCameraComp = () => {
  const { t } = useTranslation()
  const ref = useRef<Camera>(null)

  const plateHistoryRef = useRef<string[]>([])

  const pathname = usePathname()

  const scanResult = useOffenceStoreContext((state) => state.scanData?.scanResult)
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
      console.log('error')
    }
  }, [ref, setOffenceState])

  const onFrameCapture = useCallback(
    async (frame?: TextData) => {
      if (generatedEcv) return

      const ecv = scanLicencePlate(frame)

      if (ecv) {
        const plateHistory = plateHistoryRef.current
        plateHistory.push(ecv)

        if (plateHistory.length > MAX_PLATE_HISTORY) {
          plateHistory.shift()
        }

        const scannedSamePlates = plateHistory.filter((plate) => plate === ecv).length

        if (scannedSamePlates === REQUIRED_SCANS) {
          setOffenceState({ ecv })
          takeLicencePlatePicture()

          await checkEcv({ ecv })
        }
      }
    },
    [generatedEcv, checkEcv, scanLicencePlate, setOffenceState, takeLicencePlatePicture],
  )

  const onContinue = async () => {
    if (scanResult && scanResult !== ScanResultEnum.Other) {
      router.navigate('/offence')

      return
    }

    setOffenceState({ scanData: undefined })

    if (generatedEcv) {
      await checkEcv({ ecv: generatedEcv })
    }
  }

  const onChangeLicencePlate = useCallback(
    (ecv: string) => {
      plateHistoryRef.current = []

      if (!ecv) {
        setOffenceState({ ecv: '', scanData: undefined, ecvUpdatedManually: false, photos: [] })

        return
      }
      setOffenceState({ scanData: undefined, ecv, ecvUpdatedManually: !!ecv })
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

  return (
    <FlashlightContextProvider>
      <DismissKeyboard>
        <ScreenView
          title={t('scanLicencePlate.title')}
          options={{
            headerRight: () => <HomeButton />,
          }}
          className="h-full"
        >
          <View className="relative">
            <OcrCamera ref={ref} onFrameCapture={onFrameCapture} />

            <LicencePlateCameraBackground />
          </View>

          <LicencePlateCameraBottomSheet
            isLoading={isLoading}
            licencePlate={generatedEcv}
            onContinue={onContinue}
            onChangeLicencePlate={onChangeLicencePlate}
          />
        </ScreenView>
      </DismissKeyboard>
    </FlashlightContextProvider>
  )
}

export default LicencePlateCameraComp
