import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { Image, View } from 'react-native'

import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { getFavoritePhotosOptions } from '@/modules/backend/constants/queryParams'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { createUrlFromImageObject } from '@/utils/createUrlFromImageObject'

const ZonePhotoPage = () => {
  const { data, isPending, isError, error } = useQueryWithFocusRefetch(getFavoritePhotosOptions())
  const setState = useSetOffenceState()

  const udrUuid = useOffenceStoreContext((state) => state.zone?.udrUuid)

  if (isPending) {
    return <LoadingScreen title="Vyberte zónovú značku" asScreenView />
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>
  }

  const selectedZonePhotos = data.photos.filter((photo) => photo.tag === udrUuid)

  const zonePhotoCameraPath = '/zone/photo-camera'

  if (selectedZonePhotos.length === 0) {
    router.replace(zonePhotoCameraPath)
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
              setState({ zonePhoto: undefined })
              router.push(zonePhotoCameraPath)
            }}
          />
        ),
      }}
      className="flex-1 justify-start"
    >
      <FlashList
        className="h-full w-full flex-1"
        data={selectedZonePhotos}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => (
          <PressableStyled
            key={item.id}
            className="w-full items-center justify-center bg-dark-light"
            onPress={() => {
              setState({ zonePhoto: item })

              router.push(zonePhotoCameraPath)
            }}
          >
            <Image
              className="aspect-square w-full"
              source={{ uri: createUrlFromImageObject(item) }}
            />
          </PressableStyled>
        )}
        estimatedItemSize={100}
      />
    </ScreenView>
  )
}

export default ZonePhotoPage
