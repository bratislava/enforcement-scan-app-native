import { PortalHost } from '@gorhom/portal'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MapScreen from '@/components/map/MapScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import MapStoreProvider from '@/modules/map/state/MapStoreProvider/MapStoreProvider'

const ZoneScreen = () => {
  const { top } = useSafeAreaInsets()

  return (
    <MapStoreProvider>
      <ScreenView title="Vyberte zónu" className="h-full flex-1 flex-col">
        <MapScreen />

        <View className="absolute right-0 px-2.5 g-3" style={{ top }}>
          <PortalHost name="mapLeftBox" />

          <PortalHost name="mapRightBox" />
        </View>

        <PortalHost name="index" />
      </ScreenView>
    </MapStoreProvider>
  )
}

export default ZoneScreen
