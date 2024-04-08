import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { View } from 'react-native'

import RoleTile from '@/components/RoleTile'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import IconButton from '@/components/shared/IconButton'
import { useSignOut } from '@/modules/auth/hooks/useSignOut'
import { useAuthStoreContext } from '@/modules/auth/state/useAuthStoreContext'
import { RoleItem, ROLES } from '@/modules/backend/constants/roles'
import { defaultOffenceState } from '@/state/OffenceStore/OffenceStoreProvider'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const AppRoute = () => {
  const setState = useSetOffenceState()
  const signOut = useSignOut()
  const { user } = useAuthStoreContext()

  const handlePressRole = (role: RoleItem) => () => {
    setState({ roleKey: role.key, ...defaultOffenceState }, { merge: false })
    router.push(role.actions.zone ? '/zone' : '/scan/licence-plate-camera')
  }

  const allowedRoles = ROLES.filter((role) => user?.roles.includes(role.key))

  return (
    <ScreenView
      title="Enforcement"
      options={{
        headerRight: () => (
          <IconButton name="person" accessibilityLabel="Nastavenia" onPress={signOut} />
        ),
      }}
      className="flex-1 justify-start"
    >
      <ScreenContent>
        <FlashList
          ItemSeparatorComponent={() => <View className="h-2" />}
          data={allowedRoles}
          renderItem={({ item }) => <RoleTile onPress={handlePressRole(item)} {...item} />}
          estimatedItemSize={80}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default AppRoute
