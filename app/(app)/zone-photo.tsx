import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { Image } from 'react-native'

import ScreenView from '@/components/screen-layout/ScreenView'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

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

const AppRoute = () => {
  const setState = useSetOffenceState()

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

export default AppRoute
