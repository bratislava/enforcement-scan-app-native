import { LocationPuck } from '@rnmapbox/maps'

export const UserMapIndicator = () => {
  return (
    <LocationPuck
      puckBearing="heading"
      pulsing={{
        color: '#007AFF',
        isEnabled: true,
        radius: 'accuracy',
      }}
    />
  )
}
