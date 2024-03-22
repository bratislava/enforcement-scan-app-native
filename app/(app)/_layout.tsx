import Mapbox from '@rnmapbox/maps'
import { Redirect, Stack } from 'expo-router'
import { useEffect, useState } from 'react'

import { environment } from '@/environment'
import { useAuthStoreContext } from '@/modules/auth/state/useAuthStoreContext'
import { OffenceStoreProvider } from '@/state/OffenceStore/OffenceStoreProvider'
import colors from '@/tailwind.config.colors'

const RootLayout = () => {
  const { user, isLoading } = useAuthStoreContext()
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [mapboxError, setMapboxError] = useState<Error | null>(null)

  useEffect(() => {
    Mapbox.setAccessToken(environment.mapboxPublicKey)
      .finally(() => setMapboxLoaded(true))
      .catch((error) =>
        setMapboxError(error instanceof Error ? error : new Error('Unknown error - init mapbox')),
      )
  }, [])

  // Prevent rendering until the font has loaded and mapbox has loaded
  if (!mapboxLoaded) {
    return null
  }

  // let error boundary handle this
  if (mapboxError) {
    throw mapboxError
  }

  if (isLoading) return null

  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="sign-in" />
  }

  // Render the children routes now that all the assets are loaded.
  return (
    <OffenceStoreProvider>
      <Stack
        screenOptions={{
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'BelfastGrotesk_700Bold',
          },
          headerTintColor: colors.dark.DEFAULT,
        }}
      />
    </OffenceStoreProvider>
  )
}

export default RootLayout
