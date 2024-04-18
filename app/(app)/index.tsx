import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import IconButton from '@/components/shared/IconButton'
import RoleTile from '@/components/tiles/RoleTile'
import { useSignOut } from '@/modules/auth/hooks/useSignOut'
import { useAuthStoreContext } from '@/modules/auth/state/useAuthStoreContext'
import { RoleItem, ROLES } from '@/modules/backend/constants/roles'
import { getDefaultOffenceStateByRole } from '@/state/OffenceStore/getDefaultOffenceStateByRole'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const AppRoute = () => {
  const { resetOffenceState } = useSetOffenceState()
  const signOut = useSignOut()
  const { user } = useAuthStoreContext()
  const { t } = useTranslation()

  const handlePressRole = (role: RoleItem) => () => {
    resetOffenceState(getDefaultOffenceStateByRole(role.key))
    router.push(role.actions.zone ? '/zone' : '/scan/licence-plate-camera')
  }

  const allowedRoles = ROLES.filter((role) => user?.roles.includes(role.key))

  return (
    <ScreenView
      title={t('home.title')}
      options={{
        headerRight: () => (
          <IconButton name="person" accessibilityLabel="Nastavenia" onPress={signOut} />
        ),
      }}
    >
      <ScreenContent>
        <FlashList
          ItemSeparatorComponent={() => <View className="h-2" />}
          data={allowedRoles}
          renderItem={({ item }) => <RoleTile onPress={handlePressRole(item)} {...item} />}
          estimatedItemSize={111}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default AppRoute
