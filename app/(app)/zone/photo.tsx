import { FlashList } from '@shopify/flash-list'
import { Redirect, router } from 'expo-router'
import { Image, View } from 'react-native'

import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import Icon from '@/components/shared/Icon'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { getFavouritePhotosOptions } from '@/modules/backend/constants/queryParams'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { createUrlFromImageObject } from '@/utils/createUrlFromImageObject'

const ZONE_PHOTO_CAMERA_ROUTE = '/zone/photo-camera'

const ZonePhotoPage = () => {
  const { data, isPending, isError, error } = useQueryWithFocusRefetch(getFavouritePhotosOptions())
  const { setOffenceState } = useSetOffenceState()

  if (isPending) {
    return <LoadingScreen title="Vyberte zónovú značku" asScreenView />
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>
  }

  if (data.photos.length === 0) {
    return <Redirect href={ZONE_PHOTO_CAMERA_ROUTE} />
  }

  return (
    <ScreenView
      title="Vyberte zónovú fotku"
      options={{
        headerRight: () => (
          <IconButton
            name="add"
            accessibilityLabel="Nastavenia"
            onPress={() => {
              setOffenceState({ zonePhoto: undefined })
              router.push(ZONE_PHOTO_CAMERA_ROUTE)
            }}
          />
        ),
      }}
      className="flex-1 justify-start"
    >
      <FlashList
        className="h-full w-full flex-1"
        data={data.photos}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => (
          <PressableStyled
            key={item.id}
            className="relative w-full items-center justify-center overflow-hidden rounded px-6 py-3"
            onPress={() => {
              setOffenceState({ zonePhoto: item })

              router.push(ZONE_PHOTO_CAMERA_ROUTE)
            }}
          >
            <Image
              className="aspect-square w-full rounded border"
              source={{ uri: createUrlFromImageObject(item) }}
            />

            <View className="absolute h-full w-full items-center justify-center bg-black/10 ">
              <Icon name="image" size={40} className="text-white" />

              {item.tag ? (
                <Typography variant="h2" className="rounded bg-black/80 p-2 text-white">
                  {item.tag}
                </Typography>
              ) : null}
            </View>
          </PressableStyled>
        )}
        estimatedItemSize={100}
      />
    </ScreenView>
  )
}

export default ZonePhotoPage
