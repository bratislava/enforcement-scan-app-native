import 'core-js/stable/atob'

import { fetchUserInfoAsync, refreshAsync, TokenResponse } from 'expo-auth-session'
import { router, SplashScreen } from 'expo-router'
import { jwtDecode } from 'jwt-decode'
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { environment } from '@/environment'
import { AUTH_SCOPES, useAuthTokens } from '@/modules/auth/hooks/useAuthTokens'
import { useDiscovery } from '@/modules/auth/hooks/useDiscovery'

type GlobalContextProps = {
  signUpPhone: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  isLoading: boolean
}

export type LoginCredentials = {
  email: string
  password: string
}

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
  const discovery = useDiscovery()

  const onAuthStoreUpdate = useCallback(
    (newValues: Partial<GlobalContextProps>) => {
      setValues((prevValues) => ({ ...prevValues, ...newValues }))
    },
    [setValues],
  )

  const refreshToken = useCallback(async () => {
    if (tokens?.refreshToken && discovery) {
      const refreshedTokens = await refreshAsync(
        {
          refreshToken: tokens.refreshToken,
          clientId: environment.clientId,
          scopes: AUTH_SCOPES,
        },
        discovery,
      )
      if (refreshedTokens) {
        setTokens(refreshedTokens)

        const user: {
          name: string
        } = jwtDecode(refreshedTokens.accessToken)
        const idToken: { roles?: string[]; email: string } = jwtDecode(
          refreshedTokens.idToken || '',
        )

        onAuthStoreUpdate({
          user: {
            name: user.name,
            email: idToken?.email,
            roles: idToken?.roles || [],
          },
          isLoading: false,
        })
      } else {
        setTokens(null)
        onAuthStoreUpdate({ user: null, isLoading: false })
        router.push('/sign-in')
      }
    }
  }, [discovery, setTokens, onAuthStoreUpdate, tokens?.refreshToken])

  const onFetchUser = useCallback(async () => {
    if (tokens?.accessToken && TokenResponse.isTokenFresh(tokens) && discovery && !values.user) {
      const currentUser = await fetchUserInfoAsync({ accessToken: tokens.accessToken }, discovery)

      onAuthStoreUpdate({ user: currentUser, isLoading: false })
    } else if (values.user) {
      onAuthStoreUpdate({ isLoading: false })
    } else if (tokens?.refreshToken) {
      await refreshToken()
    } else {
      onAuthStoreUpdate({ user: null, isLoading: false })
    }
  }, [discovery, onAuthStoreUpdate, tokens, refreshToken, values.user])

  useEffect(() => {
    onFetchUser()
  }, [onFetchUser])

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
