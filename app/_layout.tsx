import '../global.css'

/* eslint-disable babel/camelcase */
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter'
/* eslint-enable babel/camelcase */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import OmnipresentComponent from '@/components/special/OmnipresentComponent'
import AuthStoreProvider from '@/modules/auth/state/AuthStoreProvider'
import colors from '@/tailwind.config.colors'

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    /* eslint-disable unicorn/prefer-module,global-require */
    BelfastGrotesk_700Bold: require('@/assets/fonts/Belfast-Grotesk-Bold.otf'),
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    /* eslint-enable unicorn/prefer-module,global-require */
  })

  const queryClient = new QueryClient({
    // TODO, set to 1 to prevent confusion during development, may be set to default for production
    // `gcTime` = `cacheTime` in v5: https://tanstack.com/query/latest/docs/react/guides/caching
    defaultOptions: { queries: { retry: 1, gcTime: 1000 * 60 * 60 } },
  })

  // Prevent rendering until the font has loaded
  if (!fontsLoaded) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthStoreProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <OmnipresentComponent />

            <Stack
              screenOptions={{
                headerBackTitleVisible: false,
                headerShown: false,
                headerTitleStyle: {
                  fontFamily: 'BelfastGrotesk_700Bold',
                },
                headerTintColor: colors.dark.DEFAULT,
              }}
            />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </AuthStoreProvider>
    </QueryClientProvider>
  )
}

export default RootLayout
