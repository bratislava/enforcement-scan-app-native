import { SplashScreen } from 'expo-router'
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { getCurrentAuthenticatedUser } from '@/modules/auth/utils'

type GlobalContextProps = {
  signUpPhone: string | null
  user: any | null
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

  const onAuthStoreUpdate = useCallback(
    (newValues: Partial<GlobalContextProps>) => {
      setValues((prevValues) => ({ ...prevValues, ...newValues }))
    },
    [setValues],
  )

  const onFetchUser = async () => {
    const currentUser = await getCurrentAuthenticatedUser()
    onAuthStoreUpdate({ user: currentUser, isLoading: false })
  }

  useEffect(() => {
    onFetchUser()
    // needs to be triggered only once
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
