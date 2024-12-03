import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import IconButton from '@/components/shared/IconButton'
import { List } from '@/components/shared/List'
import RoleTile from '@/components/tiles/RoleTile'
import { useAuthStoreContext } from '@/modules/auth/state/useAuthStoreContext'
import { RoleItem, ROLES } from '@/modules/backend/constants/roles'
import { getDefaultOffenceStateByRole } from '@/state/OffenceStore/getDefaultOffenceStateByRole'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const AppRoute = () => {
  const { resetOffenceState } = useSetOffenceState()
  const { user } = useAuthStoreContext()
  const { t } = useTranslation()

  const handlePressRole = (role: RoleItem) => () => {
    resetOffenceState(getDefaultOffenceStateByRole(role.key))
    router.navigate(role.actions.zone ? '/zone' : '/scan/licence-plate-camera')
  }

  const allowedRoles = ROLES.filter((role) => user?.roles.includes(role.key))

  if (allowedRoles.length === 0) {
    return (
      <EmptyStateScreen
        options={{
          headerTransparent: true,
          headerRight: () => (
            <IconButton
              name="person"
              accessibilityLabel={t('home.profile')}
              onPress={() => router.navigate('profile')}
            />
          ),
        }}
        title={t('home.title')}
        contentTitle={t('home.empty.title')}
        text={t('home.empty.text')}
      />
    )
  }

  return (
    <ScreenView
      title={t('home.title')}
      options={{
        headerRight: () => (
          <IconButton
            name="person"
            testID="profile"
            accessibilityLabel={t('home.profile')}
            onPress={() => router.navigate('profile')}
          />
        ),
      }}
    >
      <ScreenContent>
        <List
          ItemSeparatorComponent={() => <View className="h-2" />}
          data={allowedRoles}
          renderItem={({ item }) => (
            <RoleTile {...item} id={item.key} key={item.key} onPress={handlePressRole(item)} />
          )}
          estimatedItemSize={111}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default AppRoute
