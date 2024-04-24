import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Camera } from 'react-native-vision-camera'

import { TorchState } from '@/components/camera/FlashlightBottomSheetAttachment'
import FullScreenCamera from '@/components/camera/FullScreenCamera'
import LicencePlateCameraBottomSheet from '@/components/camera/LicencePlateCameraBottomSheet'
import ScreenView from '@/components/screen-layout/ScreenView'
import {
  CROPPED_PHOTO_HEIGHT,
  HEADER_WITH_PADDING,
  useScanLicencePlate,
} from '@/modules/camera/hooks/useScanLicencePlate'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const LicencePlateCameraComp = () => {
  const { t } = useTranslation()
  const ref = useRef<Camera>(null)
  const [torch, setTorch] = useState<TorchState>('off')
  const [isLoading, setIsLoading] = useState(false)

  const { top } = useSafeAreaInsets()

  const generatedEcv = useOffenceStoreContext((state) => state.ecv)
  const { setOffenceState } = useSetOffenceState()

  useCameraPermission({ autoAsk: true })

  const { scanLicencePlate, checkEcv } = useScanLicencePlate()

  const takePicture = async () => {
    setIsLoading(true)
    if (generatedEcv) {
      await checkEcv(generatedEcv)

      setIsLoading(false)

      return
    }

    const date = new Date()

    const photo = await ref.current?.takePhoto()

    if (!photo) {
      setIsLoading(false)

      return
    }

    const ecv = await scanLicencePlate(photo)
    setOffenceState({ ecv })
    setIsLoading(false)
    console.log('Time function took in seconds:', (Date.now() - date.getTime()) / 1000)
  }

  return (
    <ScreenView title={t('scanLicencePlate.title')} className="h-full">
      <FullScreenCamera ref={ref} torch={torch}>
        <View className="h-full w-full">
          <View
            style={{ paddingTop: top, height: HEADER_WITH_PADDING }}
            className="items-center justify-start bg-dark/80"
          />
          <View style={{ height: CROPPED_PHOTO_HEIGHT }} className="items-center" />
          <View className="flex-1 items-center bg-dark/80 bg-opacity-20" />
        </View>
      </FullScreenCamera>

      <LicencePlateCameraBottomSheet
        isLoading={isLoading}
        torch={torch}
        setTorch={setTorch}
        licencePlate={generatedEcv}
        takePicture={takePicture}
        onChangeLicencePlate={(ecv) => setOffenceState({ ecv })}
      />
    </ScreenView>
  )
}

export default LicencePlateCameraComp
