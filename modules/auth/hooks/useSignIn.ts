import { exchangeCodeAsync, makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { PermissionStatus } from 'expo-camera'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import { jwtDecode } from 'jwt-decode'

import { environment } from '@/environment'
import { useClearHistory } from '@/hooks/useClearHistory'
import { AUTH_SCOPES, useAuthTokens } from '@/modules/auth/hooks/useAuthTokens'
import { useDiscovery } from '@/modules/auth/hooks/useDiscovery'
import { useAuthStoreUpdateContext } from '@/modules/auth/state/useAuthStoreUpdateContext'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'
import { useLocationPermission } from '@/modules/permissions/useLocationPermission'

export const useSignIn = () => {
  const [, setTokens] = useAuthTokens()

  const onAuthStoreUpdate = useAuthStoreUpdateContext()
  const clearHistory = useClearHistory()

  const [locationPermissionStatus] = useLocationPermission()
  const [cameraPermissionStatus] = useCameraPermission()

  // Endpoint
  const discovery = useDiscovery()
  const redirectUri = makeRedirectUri({
    scheme: 'enforcement-scan-app',
    path: 'sign-in',
  })

  // Request
  const [request, , promptAsync] = useAuthRequest(
    {
      clientId: environment.clientId,
      scopes: AUTH_SCOPES,
      redirectUri,
    },
    discovery,
  )

  // console.log(response)

  const signIn = async () => {
    try {
      const codeResponse = await promptAsync()

      if (request && codeResponse?.type === 'success' && discovery) {
        const res = await exchangeCodeAsync(
          {
            clientId: environment.clientId,
            code: codeResponse.params.code,
            extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
            redirectUri,
          },
          discovery,
        )

        if (res.accessToken) {
          setTokens(res)
          console.log(res)

          const user: {
            name: string
            // eslint-disable-next-line babel/camelcase
            unique_name: string
          } = jwtDecode(res.accessToken)
          const idToken: { roles?: string[] } = jwtDecode(res.idToken || '')

          onAuthStoreUpdate({
            user: {
              name: user.name,
              email: user.unique_name,
              roles: idToken?.roles || [],
            },
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
