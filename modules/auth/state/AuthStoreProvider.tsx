import 'core-js/stable/atob'

import { TokenResponse } from 'expo-auth-session'
import { SplashScreen } from 'expo-router'
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { discovery, useAuthTokens } from '@/modules/auth/hooks/useAuthTokens'
import { GlobalContextProps } from '@/modules/auth/types'
import { getUserFromTokens, refreshToken } from '@/modules/auth/utils'

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

  const onRefreshToken = useCallback(async () => {
    if (!tokens?.refreshToken) return

    let response

    try {
      response = await refreshToken(tokens)
    } catch (error) {
      console.error('Token refresh failed:', error)
    }

    setTokens(response?.refreshedTokens || null)

    onAuthStoreUpdate({
      user: response?.user || null,
      isLoading: false,
    })
  }, [tokens, setTokens, onAuthStoreUpdate])

  const onFetchUser = useCallback(async () => {
    if (tokens?.accessToken && TokenResponse.isTokenFresh(tokens) && discovery && !values.user) {
      try {
        const currentUser = getUserFromTokens(tokens)

        onAuthStoreUpdate({ user: currentUser, isLoading: false })
      } catch (error) {
        if (tokens.refreshToken) {
          await onRefreshToken()
        }
      }
    } else if (values.user) {
      onAuthStoreUpdate({ isLoading: false })
    } else if (tokens?.refreshToken) {
      await onRefreshToken()
    } else {
      onAuthStoreUpdate({ user: null, isLoading: false })
    }
  }, [onAuthStoreUpdate, tokens, onRefreshToken, values.user])

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
