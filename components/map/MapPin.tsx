import { View } from 'react-native'

import { MapPinIcon, MapPinNoZoneIcon } from '@/assets/map'
import { useMapCenter } from '@/modules/map/hooks/useMapCenter'

type Props = {
  isZoneSelected?: boolean
}

const PIN_WIDTH = 56
const PIN_HEIGHT = 98

const MapPin = ({ isZoneSelected }: Props) => {
  const screenCenter = useMapCenter()
  const position = {
    top: screenCenter.top - PIN_HEIGHT + 4,
    left: screenCenter.left - PIN_WIDTH / 2,
  }
  const pinSize = { width: PIN_WIDTH, height: PIN_HEIGHT }

  return (
    <View className="absolute items-center" pointerEvents="none" style={position}>
      {isZoneSelected ? <MapPinIcon {...pinSize} /> : <MapPinNoZoneIcon {...pinSize} />}
    </View>
  )
}

export default MapPin
