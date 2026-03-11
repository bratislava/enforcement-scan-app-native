import { exchangeCodeAsync, makeRedirectUri, Prompt, useAuthRequest } from 'expo-auth-session'
import * as Location from 'expo-location'
import { router } from 'expo-router'

import { environment } from '@/environment'
import { AUTH_SCOPES, discovery, useAuthTokens } from '@/modules/auth/hooks/useAuthTokens'
import { useAuthStoreUpdateContext } from '@/modules/auth/state/useAuthStoreUpdateContext'
import { getUserFromTokens } from '@/modules/auth/utils'
import { PermissionStatuses } from '@/modules/camera/constants'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'
import { useLocationPermission } from '@/modules/permissions/useLocationPermission'

export const useSignIn = () => {
  const [, setTokens] = useAuthTokens()

  const onAuthStoreUpdate = useAuthStoreUpdateContext()

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
      // prompt value is here to force user to login with credentials to get rid of the issue with multiple accounts on one device.
      prompt: Prompt.Login,
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
            scopes: AUTH_SCOPES,
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
        locationPermissionStatus === Location.PermissionStatus.GRANTED ||
        cameraPermissionStatus === PermissionStatuses.GRANTED
      ) {
        router.replace('/')
      } else {
        router.replace('/permissions')
      }
    } catch (error) {
      onAuthStoreUpdate({ user: null })
      throw error
    }
  }

  return { isReady: !!request, signIn }
}
