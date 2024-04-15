import { View } from 'react-native'

import { MapPinIcon, MapPinNoZoneIcon } from '@/assets/map'
import { useMapCenter } from '@/modules/map/hooks/useMapCenter'

type Props = {
  showFullPin?: boolean
}

const PIN_WIDTH = 56
const PIN_HEIGHT = 98

const MapPin = ({ showFullPin }: Props) => {
  const screenCenter = useMapCenter({ safeArea: true })
  const position = {
    top: screenCenter.top - PIN_HEIGHT,
    left: screenCenter.left - PIN_WIDTH / 2,
  }
  const pinSize = { width: PIN_WIDTH, height: PIN_HEIGHT }

  return (
    <View className="absolute items-center" pointerEvents="none" style={position}>
      {showFullPin ? <MapPinIcon {...pinSize} /> : <MapPinNoZoneIcon {...pinSize} />}
    </View>
  )
}

export default MapPin
