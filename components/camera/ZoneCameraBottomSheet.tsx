import BottomSheet from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSharedValue } from 'react-native-reanimated'

import PassportPill from '@/components/camera/PassportPill'
import PhotoBottomSheetAttachment from '@/components/camera/PhotoBottomSheetAttachment'
import TextInput from '@/components/inputs/TextInput'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

type Props = {
  isLoading: boolean
  hasPhoto: boolean
  /** before the photo: state of the passport switch; after the photo: the flag saved by the backend */
  isPassportPhoto: boolean
  takePicture: (tag: string) => Promise<void>
  /** called before the current photo is discarded by "Odfotiť znova" */
  onRetake?: () => void
}

const ZoneCameraBottomSheet = ({
  hasPhoto,
  isLoading,
  isPassportPhoto,
  takePicture,
  onRetake,
}: Props) => {
  const { setOffenceState } = useSetOffenceState()
  const { t } = useTranslation()
  const router = useRouter()

  const zonePhotoTag = useOffenceStoreContext((state) => state.zonePhoto?.tag)
  const [tag, setTag] = useState('')

  const animatedPosition = useSharedValue(0)

  const selectPicture = () => router.push('/scan/licence-plate-camera')

  const retakePicture = () => {
    onRetake?.()
    setTag('')
    setOffenceState({ zonePhoto: undefined })
  }

  return (
    <>
      {hasPhoto ? (
        <PhotoBottomSheetAttachment animatedPosition={animatedPosition} onRetake={retakePicture} />
      ) : null}

      <BottomSheet
        handleComponent={null}
        keyboardBehavior="interactive"
        enableDynamicSizing
        animatedPosition={animatedPosition}
      >
        <BottomSheetContent className="g-2">
          {hasPhoto ? (
            <>
              <Typography variant="h2">{t('zone.confirmTitle')}</Typography>

              {isPassportPhoto ? <PassportPill /> : null}

              {zonePhotoTag ? (
                <Typography>{t('zone.tag', { tag: zonePhotoTag })}</Typography>
              ) : null}

              <Button testID="confirmPicture" loading={isLoading} onPress={selectPicture}>
                {t('zone.confirm')}
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h2">{t('zone.takePictureTitle')}</Typography>

              {isPassportPhoto ? <PassportPill /> : null}

              <TextInput
                value={tag}
                placeholder={t('zone.tag.placeholder')}
                onChangeText={(newTag) => setTag(newTag)}
              />

              <Button testID="takePicture" loading={isLoading} onPress={() => takePicture(tag)}>
                {t('zone.takePicture')}
              </Button>
            </>
          )}
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
}

export default ZoneCameraBottomSheet
