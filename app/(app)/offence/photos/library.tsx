import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenView from '@/components/screen-layout/ScreenView'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import { getPhotoUri } from '@/modules/camera/utils/getPhotoUri'
import { useCreateOffence } from '@/state/OffenceStore/useCreateOffence'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { cn } from '@/utils/cn'

const PhotosPage = () => {
  const { t } = useTranslation()
  const { photos } = useOffenceStoreContext((state) => state)

  const router = useRouter()

  const onShowDetail = (index: number) => {
    router.push({
      pathname: '/offence/photos/detail',
      params: {
        index,
      },
    })
  }

  const { onCreateOffence, isLoading } = useCreateOffence()

  return (
    <ScreenView
      actionButton={
        <ContinueButton loading={isLoading} onPress={onCreateOffence}>
          {t('offence.pictures.createOffence')}
        </ContinueButton>
      }
      title={t('offence.pictures.title')}
      className="flex-1 justify-start"
      options={{
        headerRight: () => (
          <IconButton
            accessibilityLabel={t('offence.picture.detail.add')}
            name="add"
            onPress={() => router.navigate('/offence/photos')}
          />
        ),
      }}
    >
      <FlashList
        className="h-full w-full flex-1"
        data={photos}
        ItemSeparatorComponent={() => <View className="h-2 w-2" />}
        renderItem={({ item, index }) => (
          <PressableStyled
            key={item}
            className={cn('w-full items-center justify-center')}
            onPress={() => onShowDetail(index)}
          >
            <Image className="aspect-square w-full" source={{ uri: getPhotoUri(item) }} />
          </PressableStyled>
        )}
        numColumns={2}
        estimatedItemSize={100}
      />
    </ScreenView>
  )
}

export default PhotosPage
