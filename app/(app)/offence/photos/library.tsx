import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenView from '@/components/screen-layout/ScreenView'
import PressableStyled from '@/components/shared/PressableStyled'
import { useCreateOffence } from '@/state/OffenceStore/useCreateOffence'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { cn } from '@/utils/cn'

const PhotosPage = () => {
  const { t } = useTranslation()
  const { photos } = useOffenceStoreContext((state) => state)

  const { onCreateOffence, isLoading } = useCreateOffence()

  return (
    <ScreenView
      actionButton={<ContinueButton loading={isLoading} onPress={onCreateOffence} />}
      title={t('offence.pictures.title')}
      className="flex-1 justify-start"
    >
      <FlashList
        className="h-full w-full flex-1"
        data={photos}
        ItemSeparatorComponent={() => <View className="h-2 w-2" />}
        renderItem={({ item, index }) => (
          <PressableStyled
            key={item.uri}
            className={cn('w-full items-center justify-center')}
            onPress={() => {
              router.push({
                pathname: '/offence/photos/detail',
                params: {
                  index,
                },
              })
            }}
          >
            <Image className="aspect-square w-full" source={{ uri: item.uri }} />
          </PressableStyled>
        )}
        numColumns={2}
        estimatedItemSize={100}
      />
    </ScreenView>
  )
}

export default PhotosPage
