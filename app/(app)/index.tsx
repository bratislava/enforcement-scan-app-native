import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { View } from 'react-native'

import RoleTile from '@/components/RoleTile'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import { IconName } from '@/components/shared/Icon'
import IconButton from '@/components/shared/IconButton'
import { useSignOut } from '@/modules/auth/hooks/useSignOut'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const DATA: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'map',
    title: 'PAAS',
    description: 'Lorem ipsu dolor sit amet, consectetur adipiscing elit.',
  },
  {
    icon: 'camera',
    title: 'Ne PAAS',
    description: 'Lorem ipsum dolor sit amet,consectetur adipiscing elit.',
  },
  {
    icon: 'outlined-flag',
    title: 'Testing',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
]

const AppRoute = () => {
  const setState = useSetOffenceState()
  const signOut = useSignOut()

  const handlePressRole = (role: string) => () => {
    setState({ role })
    router.push('/zone')
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
          data={DATA}
          renderItem={({ item }) => (
            <RoleTile onPress={handlePressRole(item.title)} key={item.title} {...item} />
          )}
          estimatedItemSize={80}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default AppRoute
