import { useTranslation } from 'react-i18next'

import LocationMapScreen from '@/components/map/location-map/LocationMapScreen'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import MapStoreProvider from '@/modules/map/state/MapStoreProvider/MapStoreProvider'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'

const Page = () => {
  const { t } = useTranslation()
  const roleKey = useOffenceStoreContext((state) => state.roleKey)
  const role = getRoleByKey(roleKey)

  if (!role) {
    return <ErrorScreen title={t('offence.location.error.title')} />
  }

  return (
    <MapStoreProvider>
      <ScreenView title={t('offence.location.title')} className="h-full flex-1 flex-col">
        <LocationMapScreen role={role} />
      </ScreenView>
    </MapStoreProvider>
  )
}

export default Page
