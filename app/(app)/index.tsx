import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { View } from 'react-native'

import RoleTile from '@/components/RoleTile'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import IconButton from '@/components/shared/IconButton'
import { useSignOut } from '@/modules/auth/hooks/useSignOut'
import { RoleItem, ROLES } from '@/modules/backend/constants/roles'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const AppRoute = () => {
  const setState = useSetOffenceState()
  const signOut = useSignOut()

  const handlePressRole = (role: RoleItem) => () => {
    setState({ roleKey: role.key })
    router.push(role.actions.zone ? '/zone' : '/licence-plate-camera')
  }

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
          data={ROLES}
          renderItem={({ item }) => <RoleTile onPress={handlePressRole(item)} {...item} />}
          estimatedItemSize={80}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default AppRoute
