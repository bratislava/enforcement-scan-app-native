import { exchangeCodeAsync, makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { PermissionStatus } from 'expo-camera'
import * as Location from 'expo-location'
import { router } from 'expo-router'

import { environment } from '@/environment'
import { useClearHistory } from '@/hooks/useClearHistory'
import { AUTH_SCOPES, discovery, useAuthTokens } from '@/modules/auth/hooks/useAuthTokens'
import { useAuthStoreUpdateContext } from '@/modules/auth/state/useAuthStoreUpdateContext'
import { getUserFromTokens } from '@/modules/auth/utils'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'
import { useLocationPermission } from '@/modules/permissions/useLocationPermission'

export const useSignIn = () => {
  const [, setTokens] = useAuthTokens()

  const onAuthStoreUpdate = useAuthStoreUpdateContext()
  const clearHistory = useClearHistory()

  const [locationPermissionStatus] = useLocationPermission()
  const [cameraPermissionStatus] = useCameraPermission()

  const redirectUri = makeRedirectUri({
    scheme: 'enforcement-scan-app',
    path: 'sign-in',
  })

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId: environment.clientId,
      scopes: AUTH_SCOPES,
      redirectUri,
    },
    discovery,
  )

  const signIn = async () => {
    try {
      const codeResponse = await promptAsync()

      if (request && codeResponse?.type === 'success' && discovery) {
        const res = await exchangeCodeAsync(
          {
            clientId: environment.clientId,
            scopes: [`api://${environment.clientId}/user_auth`, ...AUTH_SCOPES],
            code: codeResponse.params.code,
            extraParams: request.codeVerifier
              ? {
                  code_verifier: request.codeVerifier,
                }
              : undefined,
            redirectUri,
          },
          discovery,
        )

        if (res.accessToken) {
          setTokens(res)

          const user = getUserFromTokens(res)

          onAuthStoreUpdate({
            user,
          })
        }
      }

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
  }

  return { isReady: !!request, signIn }
}
