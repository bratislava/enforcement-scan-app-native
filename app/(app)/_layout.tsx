import { Redirect, Stack } from 'expo-router'

import { useAuthStoreContext } from '@/modules/auth/state/useAuthStoreContext'
import colors from '@/tailwind.config.colors'

const RootLayout = () => {
  const { user, isLoading } = useAuthStoreContext()

  if (isLoading) return null

  if (!user) {
    console.log('aaa')

    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="sign-in" />
  }

  // Render the children routes now that all the assets are loaded.
  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontFamily: 'BelfastGrotesk_700Bold',
        },
        headerTintColor: colors.dark.DEFAULT,
      }}
    />
  )
}

export default RootLayout
