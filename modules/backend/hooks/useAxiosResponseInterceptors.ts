import axios, { AxiosResponse, isAxiosError } from 'axios'
import { useCallback, useEffect } from 'react'

import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import { AUTHENTICATION_TOKENS_KEY, discovery } from '@/modules/auth/hooks/useAuthTokens'
import { useAuthStoreUpdateContext } from '@/modules/auth/state/useAuthStoreUpdateContext'
import { refreshToken } from '@/modules/auth/utils'
import { axiosInstance } from '@/modules/backend/axios-instance'
import { storage } from '@/utils/mmkv'

// https://dev.to/arianhamdi/react-hooks-in-axios-interceptors-3e1h

export const useAxiosResponseInterceptors = () => {
  const snackbar = useSnackbar()
  const onAuthStoreUpdate = useAuthStoreUpdateContext()

  const onRefreshToken = useCallback(async () => {
    const tokens = JSON.parse(storage.getString(AUTHENTICATION_TOKENS_KEY) || '{}')

    if (!tokens?.refreshToken) return ''

    try {
      const response = await refreshToken(tokens)

      if (!response) throw new Error('Token refresh failed')

      storage.set(AUTHENTICATION_TOKENS_KEY, JSON.stringify(response?.refreshedTokens))

      onAuthStoreUpdate({
        user: response.user || null,
        isLoading: false,
      })

      return response.refreshedTokens.accessToken
    } catch (error) {
      storage.delete(AUTHENTICATION_TOKENS_KEY)
      onAuthStoreUpdate({ user: null, isLoading: false })

      return ''
    }
  }, [onAuthStoreUpdate])

  useEffect(() => {
    const errorInterceptor = async (error: unknown) => {
      let snackbarMessage = null
      if (isAxiosError(error)) {
        const { status, data } = error.response ?? {}
        const { errorName, message }: { errorName?: string; message?: string } = data

        // eslint-disable-next-line sonarjs/no-small-switch
        switch (status) {
          case 422:
            // the 422 errors are handled localy
            break
          case 424:
            if (errorName || message) {
              snackbarMessage = errorName && message
            }
            break
          case 401:
            if (discovery) {
              const accessToken = await onRefreshToken()

              if (accessToken) {
                axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`

                return axiosInstance(error?.config || {})
              }
              snackbarMessage = 'Vaša prihlásenie vypršalo. Prosím prihláste sa znova.'
            }
            break

          default:
            if (status) {
              snackbarMessage ??= status.toString()
            }

            snackbarMessage ??=
              'Pri spracovaní vašej požiadavky sa vyskytla chyba. Skúste to prosím neskôr.'
            break
        }
      } else snackbarMessage ??= 'Vyskytla sa chyba.'

      if (snackbarMessage) {
        snackbar.show(snackbarMessage, { variant: 'danger' })
      }

      throw error
    }

    const successInterceptor = (response: AxiosResponse) => {
      return response
    }

    const interceptor = axiosInstance.interceptors.response.use(
      successInterceptor,
      errorInterceptor,
    )

    return () => axiosInstance.interceptors.response.eject(interceptor)
  }, [onRefreshToken, snackbar])
}
