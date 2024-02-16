import { router } from 'expo-router'

import { useAuthStoreUpdateContext } from '@/modules/auth/state/useAuthStoreUpdateContext'

/**
 * Sign out, set AuthStore user to null and redirect to sign in page
 */
export const useSignOut = () => {
  const onAuthStoreUpdate = useAuthStoreUpdateContext()

  return async () => {
    try {
      // TODO: implement signOut
      // await signOut()
      onAuthStoreUpdate({ user: null })
      router.push('/sign-in')
    } catch (error) {
      console.log('error signing out', error)
    }
  }
}
