import { CameraPermissionStatus } from 'react-native-vision-camera'

export const PermissionStatuses: Record<string, CameraPermissionStatus> = {
  /**
   * User has granted the permission.
   */
  GRANTED: 'granted',
  /**
   * User hasn't granted or denied the permission yet.
   */
  UNDETERMINED: 'not-determined',
  /**
   * User has denied the permission.
   */
  DENIED: 'denied',
  RESTRICTED: 'restricted',
}
