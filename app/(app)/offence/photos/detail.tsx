import { router, useLocalSearchParams } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image } from 'react-native'
import { Camera } from 'react-native-vision-camera'

import CameraBottomSheet from '@/components/camera/CameraBottomSheet'
import { TorchState } from '@/components/camera/FlashlightBottomSheetAttachment'
import FullScreenCamera from '@/components/camera/FullScreenCamera'
import ScreenView from '@/components/screen-layout/ScreenView'
import IconButton from '@/components/shared/IconButton'
import { getPhotoUri } from '@/modules/camera/utils/getPhotoUri'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { addImageCdnUrl } from '@/utils/addImageCdnUrl'
import { addTextToImage } from '@/utils/addTextToImage'

type PhotoDetailSearchParams = {
  index: string
}

const AppRoute = () => {
  const { t } = useTranslation()
  const { index } = useLocalSearchParams<PhotoDetailSearchParams>()
  const photoIndex = Number(index)

  const { setOffenceState } = useSetOffenceState()
  const photos = useOffenceStoreContext((state) => state.photos)
  const zonePhotoUrl = useOffenceStoreContext((state) => state.zonePhoto?.photoUrl)

  const ref = useRef<Camera>(null)

  const [photo, setPhoto] = useState<string | null>(
    (index ? photos[photoIndex] : zonePhotoUrl) || null,
  )
  const [isRetaking, setIsRetaking] = useState(false)
  const [torch, setTorch] = useState<TorchState>('off')
  const [loading, setLoading] = useState(false)

  const takePicture = async () => {
    setLoading(true)
    const capturedPhoto = await ref.current?.takePhoto()
    const imageWithTimestampUri = await addTextToImage({
      text: new Date().toLocaleString(),
      imagePath: capturedPhoto?.path,
    })

    if (!imageWithTimestampUri) {
      setLoading(false)

      return
    }

    setPhoto(imageWithTimestampUri)

    setLoading(false)
  }

  const selectPicture = () => {
    if (!(photo && isRetaking)) return

    const newPhotos = [...photos]
    newPhotos.splice(photoIndex, 1, photo)

    setOffenceState({ photos: newPhotos })
    router.navigate('/offence/photos/library')
  }

  const retakePicture = () => {
    setIsRetaking(true)
    setPhoto(null)
  }

  return (
    <ScreenView
      hasBackButton
      title={t('offence.picture.detail.title')}
      options={
        index
          ? {
              headerRight: () => (
                <IconButton
                  accessibilityLabel={t('offence.picture.detail.retake')}
                  name="cached"
                  onPress={retakePicture}
                />
              ),
            }
          : undefined
      }
      className="h-full"
    >
      {photo ? (
        <Image
          source={{
            uri: index
              ? getPhotoUri(photo) || getPhotoUri(photos[photoIndex])
              : addImageCdnUrl(photo),
          }}
          resizeMode="contain"
          style={{ flex: 1 }}
        />
      ) : (
        <FullScreenCamera ref={ref} torch={torch} />
      )}

      {isRetaking ? (
        <CameraBottomSheet
          hasPhoto={!!photo}
          torch={torch}
          isLoading={loading}
          takePicture={takePicture}
          selectPicture={selectPicture}
          retakePicture={index ? retakePicture : undefined}
          setTorch={setTorch}
        />
      ) : null}
    </ScreenView>
  )
}

export default AppRoute
