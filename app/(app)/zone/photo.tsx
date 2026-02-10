import { Redirect, router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

import ContinueButton from '@/components/navigation/ContinueButton'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import Icon from '@/components/shared/Icon'
import IconButton from '@/components/shared/IconButton'
import { List } from '@/components/shared/List'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { getZoneSignPhotosOptions } from '@/modules/backend/constants/queryOptions'
import { ResponseZoneSignPhotoPropertiesDto } from '@/modules/backend/openapi-generated'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { createUrlFromImageObject } from '@/utils/createUrlFromImageObject'

const ZONE_PHOTO_CAMERA_ROUTE = '/zone/photo-camera'

const ZonePhotoPage = () => {
  const { t } = useTranslation()

  const { data, isPending, isError, error } = useQueryWithFocusRefetch(getZoneSignPhotosOptions())
  const { setOffenceState } = useSetOffenceState()

  const redirectToCamera = (zonePhoto?: ResponseZoneSignPhotoPropertiesDto) => {
    setOffenceState({ zonePhoto })
    router.push(ZONE_PHOTO_CAMERA_ROUTE)
  }

  if (isPending) {
    return <LoadingScreen title={t('zone.photo.title')} asScreenView />
  }

  if (isError) {
    return (
      <ErrorScreen
        text={error?.message}
        actionButton={<ContinueButton onPress={() => redirectToCamera()} />}
      />
    )
  }

  if (data.photos.length === 0) {
    return <Redirect href={ZONE_PHOTO_CAMERA_ROUTE} />
  }

  return (
    <ScreenView
      title={t('zone.photo.title')}
      options={{
        headerRight: () => (
          <IconButton
            name="add"
            testID="addPhoto"
            accessibilityLabel={t('zone.photo.new')}
            onPress={() => redirectToCamera()}
          />
        ),
      }}
      className="flex-1 justify-start"
    >
      <List
        className="h-full w-full flex-1"
        data={data.photos}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => (
          <PressableStyled
            key={item.id}
            className="relative w-full items-center justify-center overflow-hidden rounded px-6 py-3"
            onPress={() => redirectToCamera(item)}
          >
            <Image
              className="aspect-square w-full rounded border"
              source={{ uri: createUrlFromImageObject(item) }}
            />

            <View className="absolute h-full w-full items-center justify-center rounded bg-black/10">
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
