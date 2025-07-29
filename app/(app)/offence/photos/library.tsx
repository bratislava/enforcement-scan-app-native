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
import { addImageCdnUrl } from '@/utils/addImageCdnUrl'
import { cn } from '@/utils/cn'
import { isDefined } from '@/utils/isDefined'

const PhotosPage = () => {
  const { t } = useTranslation()
  const photos = useOffenceStoreContext((state) => state.photos)
  const zonePhotoUrl = useOffenceStoreContext((state) => state.zonePhoto?.photoUrl)

  const router = useRouter()

  const onShowDetail = (index: number) => {
    router.navigate({
      pathname: '/offence/photos/detail',
      params: {
        index: zonePhotoUrl ? (index === 0 ? undefined : String(index - 1)) : String(index),
      },
    })
  }

  const { onCreateOffence, isLoading } = useCreateOffence()

  return (
    <ScreenView
      actionButton={
        <ContinueButton testID="createOffence" loading={isLoading} onPress={onCreateOffence}>
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
            onPress={() => router.push('/offence/photos')}
          />
        ),
      }}
    >
      {/* We are not using the custom List component, because this usage is lot different than other lists. We have multiple columns here and not using ScreenContent component */}
      <FlashList
        className="h-full w-full flex-1"
        data={[zonePhotoUrl, ...photos].filter(isDefined)}
        ItemSeparatorComponent={() => <View className="h-2 w-2" />}
        renderItem={({ item, index }) => (
          <PressableStyled
            key={item}
            className={cn('w-full items-center justify-center')}
            onPress={() => onShowDetail(index)}
          >
            <Image
              className="aspect-square w-full"
              source={{
                uri: item?.includes('cache') ? getPhotoUri(item) : addImageCdnUrl(item),
              }}
            />
          </PressableStyled>
        )}
        numColumns={2}
        estimatedItemSize={100}
      />
    </ScreenView>
  )
}

export default PhotosPage
