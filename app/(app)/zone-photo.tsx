import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { Image, useWindowDimensions } from 'react-native'

import ScreenView from '@/components/screen-layout/ScreenView'
import Icon from '@/components/shared/Icon'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
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
  const { width } = useWindowDimensions()

  return (
    <ScreenView title="Vyberte zónovú fotku" className="flex-1 justify-start">
      <FlashList
        className="h-full w-full flex-1"
        data={[...images, undefined]}
        renderItem={({ item }) => (
          <PressableStyled
            key={item}
            style={{ height: width / 3 }}
            className="w-full items-center justify-center bg-dark-light"
            onPress={() => {
              setState({ zonePhoto: item })

              router.push('/zone-photo-camera')
            }}
          >
            {item ? (
              <Image className="w-full" style={{ height: width / 3 }} source={{ uri: item }} />
            ) : (
              <>
                <Icon name="photo-camera" size={40} />
                <Typography variant="h3" className="mt-2">
                  Pridať fotku
                </Typography>
              </>
            )}
          </PressableStyled>
        )}
        numColumns={3}
        estimatedItemSize={100}
      />
    </ScreenView>
  )
}

export default AppRoute
