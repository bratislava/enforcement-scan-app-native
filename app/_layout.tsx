import '../global.css'

/* eslint-disable babel/camelcase */
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter'
/* eslint-enable babel/camelcase */
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, Text, View } from 'react-native'

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    /* eslint-disable unicorn/prefer-module,global-require */
    BelfastGrotesk_700Bold: require('@/assets/fonts/Belfast-Grotesk-Bold.otf'),
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    /* eslint-enable unicorn/prefer-module,global-require */
  })

  // Prevent rendering until the font has loaded
  if (!fontsLoaded) {
    return null
  }

  return (
    <SafeAreaView>
      <View className="h-full w-full items-center justify-center">
        <Text>Open up App.js to start working on your app!</Text>
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  )
}

export default RootLayout
