import { AUTHENTICATION_TOKENS_KEY } from '@/modules/auth/hooks/useAuthTokens'
import { useAuthStoreUpdateContext } from '@/modules/auth/state/useAuthStoreUpdateContext'
import { storage } from '@/utils/mmkv'

/**
 * Sign out, set AuthStore user to null and redirect to sign in page
 */
export const useSignOut = () => {
  const onAuthStoreUpdate = useAuthStoreUpdateContext()

  return async () => {
    try {
      onAuthStoreUpdate({ user: null })
      storage.delete(AUTHENTICATION_TOKENS_KEY)
    } catch (error) {
      console.log('error signing out', error)
    }
  }
}
