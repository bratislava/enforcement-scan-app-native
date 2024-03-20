import { PermissionStatus } from 'expo-camera'
import * as Location from 'expo-location'
import { router } from 'expo-router'

import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import { useClearHistory } from '@/hooks/useClearHistory'
import { LoginCredentials } from '@/modules/auth/state/AuthStoreProvider'
import { useAuthStoreUpdateContext } from '@/modules/auth/state/useAuthStoreUpdateContext'
import { getCurrentAuthenticatedUser } from '@/modules/auth/utils'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'
import { useLocationPermission } from '@/modules/permissions/useLocationPermission'

export const useSignIn = () => {
  const snackbar = useSnackbar()

  const onAuthStoreUpdate = useAuthStoreUpdateContext()
  const clearHistory = useClearHistory()

  const [locationPermissionStatus] = useLocationPermission()
  const [cameraPermissionStatus] = useCameraPermission()

  return async (data: LoginCredentials) => {
    try {
      try {
        /** Try to sign in the user. Cognito will throw an error for non-registered user. */
        const user = await getCurrentAuthenticatedUser()
        onAuthStoreUpdate({ user: {} })

        if (
          locationPermissionStatus === Location.PermissionStatus.UNDETERMINED ||
          cameraPermissionStatus === PermissionStatus.UNDETERMINED
        ) {
          router.replace('/permissions')
        } else {
          router.replace('/')
        }
        clearHistory()
      } catch (error) {
        onAuthStoreUpdate({ user: null })
        throw error
      }
    } catch (error) {
      snackbar.show('Error while logging in', { variant: 'danger' })
      throw error
    }
  }
}
