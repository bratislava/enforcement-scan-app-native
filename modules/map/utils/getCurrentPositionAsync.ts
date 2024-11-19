import * as Device from 'expo-device'
import * as Location from 'expo-location'

/**
 * Requests for one-time delivery of the user's current location. If app runs on emulator the mocked object will be returned.
 * the expo emulator we run tests on does not support location services.
 */
export const getCurrentPositionAsync = async (
  options?: Location.LocationOptions,
): Promise<Location.LocationObject> => {
  if (Device.isDevice) {
    return Location.getCurrentPositionAsync(options)
  }

  // If app is not running on a device return mocked data
  return {
    coords: {
      latitude: 48.150_636,
      longitude: 17.111_754,
      altitude: 0,
      accuracy: 1,
      altitudeAccuracy: 1,
      heading: 1,
      speed: 0,
    },
    timestamp: Date.now(),
    mocked: true,
  } satisfies Location.LocationObject
}
