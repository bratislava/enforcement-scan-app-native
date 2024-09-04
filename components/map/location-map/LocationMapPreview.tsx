import { Camera, MapView, MarkerView, UserLocation } from '@rnmapbox/maps'
import { View } from 'react-native'

import { MapPinIcon } from '@/assets/map'
import MapZones from '@/components/map/MapZones'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { LOCATION_PREVIEW_DEFAULT_ZOOM, MAP_STYLE_URL } from '@/modules/map/constants'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'

const LocationMapPreview = () => {
  const location = useOffenceStoreContext((state) => state.location)
  const roleKey = useOffenceStoreContext((state) => state.roleKey)
  const role = getRoleByKey(roleKey)

  return (
    <View className="h-40 overflow-hidden rounded-lg border border-divider">
      {location ? (
        <MapView
          style={{ flex: 1 }}
          styleURL={MAP_STYLE_URL}
          zoomEnabled={false}
          scrollEnabled={false}
          pitchEnabled={false}
          scaleBarEnabled={false}
        >
          <Camera
            animationMode="moveTo"
            minZoomLevel={LOCATION_PREVIEW_DEFAULT_ZOOM}
            centerCoordinate={[location.long, location.lat]}
          />

          {role?.actions.zone ? <MapZones /> : null}

          <UserLocation androidRenderMode="gps" visible minDisplacement={3} animated />

          <MarkerView
            // anchored to the bottom of the pin
            anchor={{
              x: 0.5,
              y: 1,
            }}
            coordinate={[location.long, location.lat]}
          >
            <MapPinIcon height={80} />
          </MarkerView>
        </MapView>
      ) : null}
    </View>
  )
}

export default LocationMapPreview
