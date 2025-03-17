import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import { List } from '@/components/shared/List'
import Typography from '@/components/shared/Typography'
import PermitTile from '@/components/tiles/PermitTile'
import TicketTile from '@/components/tiles/TicketTile'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { getLicencePlateTicketsAndPermitsInfo } from '@/modules/backend/constants/queryOptions'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'

const ScanLicencePlateInfoScreen = () => {
  const { t } = useTranslation()

  const ecv = useOffenceStoreContext((state) => state.ecv)

  const { data, isError, error, isPending, refetch, isRefetching } = useQueryWithFocusRefetch(
    getLicencePlateTicketsAndPermitsInfo(ecv),
  )

  if (isPending) {
    return <LoadingScreen title={t('scanLicencePlate.info.title')} asScreenView />
  }

  if (isError) {
    return <ErrorScreen text={error?.message} />
  }

  if (data.permitCards.length === 0 && data.tickets.length === 0) {
    return (
      <EmptyStateScreen
        title={t('scanLicencePlate.info.title')}
        contentTitle={t('scanLicencePlate.info.empty.title')}
        text={t('scanLicencePlate.info.empty.text')}
        actionButton={
          <Button loading={isRefetching} onPress={() => refetch()}>
            {t('scanLicencePlate.info.empty.action')}
          </Button>
        }
      />
    )
  }

  return (
    <ScreenView title={t('scanLicencePlate.info.title')}>
      <ScreenContent>
        {data.tickets.length > 0 ? (
          <>
            <Typography variant="h1">{t('scanLicencePlate.info.tickets.title')}</Typography>

            <List
              onRefresh={refetch}
              estimatedItemSize={78}
              refreshing={isRefetching}
              ItemSeparatorComponent={() => <View className="h-2" />}
              data={data.tickets}
              renderItem={({ item }) => <TicketTile {...item} />}
            />
          </>
        ) : null}

        {data.permitCards.length > 0 ? (
          <>
            <Typography variant="h1">{t('scanLicencePlate.info.permits.title')}</Typography>

            <List
              onRefresh={refetch}
              estimatedItemSize={102}
              refreshing={isRefetching}
              ItemSeparatorComponent={() => <View className="h-2" />}
              data={data.permitCards}
              renderItem={({ item }) => <PermitTile {...item} />}
            />
          </>
        ) : null}
      </ScreenContent>
    </ScreenView>
  )
}

export default ScanLicencePlateInfoScreen
