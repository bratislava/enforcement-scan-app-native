import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { Image } from 'react-native'

import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { getFavoritePhotosOptions } from '@/modules/backend/constants/queryParams'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'

const images = [
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150/0000FF',
  'https://via.placeholder.com/150/008000',
  'https://via.placeholder.com/150/FF0000',
  'https://via.placeholder.com/150/FFFF00',
  'https://via.placeholder.com/150/000080',
  'https://via.placeholder.com/150/808080',
  'https://via.placeholder.com/150/FFA07A',
  'https://via.placeholder.com/150/FFC0CB',
  'https://via.placeholder.com/150/F0E68C',
]

const ZonePhotoPage = () => {
  const { data, isPending, isError, error } = useQueryWithFocusRefetch(getFavoritePhotosOptions())
  const setState = useSetOffenceState()

  if (isPending) {
    return <LoadingScreen title="Vyberte zónovú značku" asScreenView />
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>
  }

  if (data?.photos.length === 0) {
    return <EmptyStateScreen title="title" contentTitle="noAnnouncementsTitle" />
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
              router.push('/zone-photo-camera')
            }}
          />
        ),
      }}
      className="flex-1 justify-start"
    >
      <FlashList
        className="h-full w-full flex-1"
        data={images}
        renderItem={({ item }) => (
          <PressableStyled
            key={item}
            className="w-full items-center justify-center bg-dark-light"
            onPress={() => {
              setState({ zonePhoto: item })

              router.push('/zone-photo-camera')
            }}
          >
            <Image className="aspect-square w-full" source={{ uri: item }} />
          </PressableStyled>
        )}
        estimatedItemSize={100}
      />
    </ScreenView>
  )
}

export default ZonePhotoPage
