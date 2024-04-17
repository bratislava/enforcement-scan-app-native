import LocationMapScreen from '@/components/map/location-map/LocationMapScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import MapStoreProvider from '@/modules/map/state/MapStoreProvider/MapStoreProvider'

const Page = () => (
  <MapStoreProvider>
    <ScreenView title="Vyberte miesto" className="h-full flex-1 flex-col">
      <LocationMapScreen />
    </ScreenView>
  </MapStoreProvider>
)

export default Page
