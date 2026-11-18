import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import * as Location from 'expo-location'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'
import { Camera } from 'react-native-vision-camera'

import FullScreenCamera from '@/components/camera/FullScreenCamera'
import PassportPhotoSwitch from '@/components/camera/PassportPhotoSwitch'
import ZoneCameraBottomSheet from '@/components/camera/ZoneCameraBottomSheet'
import ScreenView from '@/components/screen-layout/ScreenView'
import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import { clientApi } from '@/modules/backend/client-api'
import { getZoneSignPhotosOptions } from '@/modules/backend/constants/queryOptions'
import FlashlightContextProvider from '@/modules/camera/state/FlashlightContextProvider'
import { useGetNearestSign } from '@/modules/map/hooks/useGetNearestSign'
import { getCurrentPositionAsync } from '@/modules/map/utils/getCurrentPositionAsync'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { addGpsMetadataToImage } from '@/utils/addGpsMetadataToImage'
import { addTextToImage } from '@/utils/addTextToImage'
import { coordsToString } from '@/utils/coordsToString'
import { createUrlFromImageObject } from '@/utils/createUrlFromImageObject'

const AppRoute = () => {
  const { t } = useTranslation()
  const { setOffenceState } = useSetOffenceState()
  const snackbar = useSnackbar()
  const zonePhoto = useOffenceStoreContext((state) => state.zonePhoto)
  const udr = useOffenceStoreContext((state) => state.zone?.udrId)
  const selectedSignId = useOffenceStoreContext((state) => state.zoneSignGlobalId)

  const { getNearestSign } = useGetNearestSign()

  const ref = useRef<Camera>(null)
  const [loading, setLoading] = useState(false)
  // off by default, reset after every successful upload
  const [isPassportPhoto, setIsPassportPhoto] = useState(false)
  // id of the passport photo uploaded on this screen, a retake of it keeps the switch on
  const uploadedPassportPhotoId = useRef<number | null>(null)

  const queryClient = useQueryClient()

  const createPhotoMutation = useMutation({
    mutationFn: ({
      file,
      globalId,
      tag,
      lat,
      long,
      isPassportPhoto: isPassport,
    }: {
      file: File
      globalId: string
      tag: string
      lat: number
      long: number
      isPassportPhoto: boolean
    }) => clientApi.scanControllerCreateZoneSignPhoto(file, globalId, tag, lat, long, isPassport),
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: getZoneSignPhotosOptions().queryKey })
    },
  })

  const takePicture = async (tag: string) => {
    setLoading(true)

    // finally resets loading also when GPS, the camera or the image processing throws,
    // otherwise the screen and the passport switch stay disabled
    try {
      const { coords } = await getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      })
      // the sign screen always sets the selected sign before opening the camera,
      // the nearest sign to GPS is only a defensive fallback that the normal flow does not reach
      const zoneSignGlobalId = selectedSignId ?? getNearestSign(coords, udr)?.properties.GlobalID
      const locationString = coords ? `${coordsToString(coords.latitude, coords.longitude)}; ` : ''

      const capturedPhoto = await ref.current?.takePhoto()

      const imageWithTimestampUri = await addTextToImage({
        text: `${locationString}${new Date().toLocaleString()}`,
        imagePath: capturedPhoto?.path,
      })

      const imageWithMetadataUri = coords
        ? await addGpsMetadataToImage({
            imagePath: imageWithTimestampUri,
            lat: coords.latitude,
            long: coords.longitude,
          })
        : imageWithTimestampUri

      if (!zoneSignGlobalId) {
        snackbar.show(t('zone.sign.missing'), { variant: 'danger' })

        return
      }

      if (!imageWithTimestampUri) {
        snackbar.show(t('offenceCamera.error'), { variant: 'danger' })

        return
      }

      const timeString = new Date().toLocaleString('sk-SK', { hour: '2-digit', minute: '2-digit' })
      const photoResponse = await createPhotoMutation.mutateAsync({
        file: {
          uri: imageWithMetadataUri,
          type: 'image/jpeg',
          name: imageWithMetadataUri.split('/').pop()!,
        } as unknown as File,
        tag: [tag, udr, timeString].filter(Boolean).join(' '),
        globalId: zoneSignGlobalId,
        lat: coords?.latitude,
        long: coords?.longitude,
        isPassportPhoto,
      })

      uploadedPassportPhotoId.current = photoResponse.data.isPassportPhoto
        ? photoResponse.data.id
        : null
      setOffenceState({ zonePhoto: photoResponse.data })
      setIsPassportPhoto(false)
    } catch (error) {
      // the axios interceptor already shows a snackbar for failed requests
      if (!isAxiosError(error)) {
        snackbar.show(t('offenceCamera.error'), { variant: 'danger' })
      }
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRetake = () => {
    // the inspector rejected a passport photo taken here, the next photo is meant as the passport photo again
    setIsPassportPhoto(!!zonePhoto && zonePhoto.id === uploadedPassportPhotoId.current)
  }

  console.log(zonePhoto ? createUrlFromImageObject(zonePhoto) : undefined)

  return (
    <FlashlightContextProvider>
      <ScreenView
        hasBackButton
        title={t('zone.zonePicture')}
        className="h-full"
        options={{
          // the flag is saved with the photo, so the switch is shown only before the upload
          headerRight: zonePhoto
            ? undefined
            : () => (
                <PassportPhotoSwitch
                  value={isPassportPhoto}
                  onValueChange={setIsPassportPhoto}
                  disabled={loading}
                />
              ),
        }}
      >
        {zonePhoto ? (
          <Image
            source={{ uri: createUrlFromImageObject(zonePhoto) }}
            resizeMode="contain"
            style={{ flex: 1 }}
          />
        ) : (
          <View className="relative">
            <FullScreenCamera ref={ref} />
            {isPassportPhoto ? (
              <View
                testID="passportFrame"
                pointerEvents="none"
                className="absolute inset-0 border-4 border-info"
              />
            ) : null}
          </View>
        )}

        <ZoneCameraBottomSheet
          hasPhoto={!!zonePhoto}
          isLoading={loading}
          isPassportPhoto={zonePhoto ? !!zonePhoto.isPassportPhoto : isPassportPhoto}
          takePicture={takePicture}
          onRetake={handleRetake}
        />
      </ScreenView>
    </FlashlightContextProvider>
  )
}

export default AppRoute
