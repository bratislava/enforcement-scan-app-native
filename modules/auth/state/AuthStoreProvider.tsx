import 'core-js/stable/atob'

import { refreshAsync, TokenResponse } from 'expo-auth-session'
import { SplashScreen } from 'expo-router'
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { environment } from '@/environment'
import { AUTH_SCOPES, discovery, useAuthTokens } from '@/modules/auth/hooks/useAuthTokens'
import { GlobalContextProps } from '@/modules/auth/types'
import { getUserFromTokens } from '@/modules/auth/utils'

export const AuthStoreContext = createContext<GlobalContextProps | null>(null)
AuthStoreContext.displayName = 'AuthStoreContext'

export const AuthStoreUpdateContext = createContext<
  ((newValues: Partial<GlobalContextProps>) => void) | null
>(null)

const AuthStoreProvider = ({ children }: PropsWithChildren) => {
  const [values, setValues] = useState<GlobalContextProps>({
    signUpPhone: null,
    user: null,
    isLoading: true,
  })
  const [tokens, setTokens] = useAuthTokens()

  const onAuthStoreUpdate = useCallback(
    (newValues: Partial<GlobalContextProps>) => {
      setValues((prevValues) => ({ ...prevValues, ...newValues }))
    },
    [setValues],
  )

  const refreshToken = useCallback(async () => {
    if (tokens?.refreshToken && discovery) {
      try {
        const refreshedTokens = await refreshAsync(
          {
            refreshToken: tokens.refreshToken,
            clientId: environment.clientId,
            scopes: [`api://${environment.clientId}/user_auth`, ...AUTH_SCOPES],
          },
          discovery,
        )
        if (refreshedTokens) {
          setTokens(refreshedTokens)

          const user = getUserFromTokens(refreshedTokens)

          onAuthStoreUpdate({
            user,
            isLoading: false,
          })
        }
      } catch (error) {
        setTokens(null)
        onAuthStoreUpdate({ user: null, isLoading: false })
      }
    }
  }, [setTokens, onAuthStoreUpdate, tokens?.refreshToken])

  const onFetchUser = useCallback(async () => {
    if (tokens?.accessToken && TokenResponse.isTokenFresh(tokens) && discovery && !values.user) {
      try {
        const currentUser = getUserFromTokens(tokens)

        onAuthStoreUpdate({ user: currentUser, isLoading: false })
      } catch (error) {
        if (tokens.refreshToken) {
          await refreshToken()
        }
      }
    } else if (values.user) {
      onAuthStoreUpdate({ isLoading: false })
    } else if (tokens?.refreshToken) {
      await refreshToken()
    } else {
      onAuthStoreUpdate({ user: null, isLoading: false })
    }
  }, [onAuthStoreUpdate, tokens, refreshToken, values.user])

  useEffect(() => {
    onFetchUser()
    // needs to be called only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Hide splash screen when user is loaded and translations are ready
  useEffect(() => {
    if (!values.isLoading) {
      SplashScreen.hideAsync()
    }
  }, [values.isLoading])

  return (
    <AuthStoreUpdateContext.Provider value={onAuthStoreUpdate}>
      <AuthStoreContext.Provider value={values}>{children}</AuthStoreContext.Provider>
    </AuthStoreUpdateContext.Provider>
  )
}

export default AuthStoreProvider
