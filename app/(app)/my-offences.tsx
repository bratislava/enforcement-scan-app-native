import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import { List } from '@/components/shared/List'
import OffenceTile from '@/components/tiles/OffenceTile'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { getOffencesOverview } from '@/modules/backend/constants/queryOptions'

const MyOffences = () => {
  const { t } = useTranslation()

  const { data, isError, error, isPending, refetch, isRefetching } =
    useQueryWithFocusRefetch(getOffencesOverview())

  if (isPending) {
    return <LoadingScreen title={t('myOffences.title')} asScreenView />
  }

  if (isError) {
    return <ErrorScreen text={error?.message} />
  }

  if (data.length === 0) {
    return (
      <EmptyStateScreen
        title={t('myOffences.title')}
        contentTitle={t('myOffences.empty.title')}
        text={t('myOffences.empty.text')}
      />
    )
  }

  return (
    <ScreenView title={t('myOffences.title')}>
      <ScreenContent>
        <List
          onRefresh={refetch}
          refreshing={isRefetching}
          estimatedItemSize={104}
          ItemSeparatorComponent={() => <View className="h-2" />}
          data={data}
          renderItem={({ item }) => <OffenceTile {...item} />}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default MyOffences
