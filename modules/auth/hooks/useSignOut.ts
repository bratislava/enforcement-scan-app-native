import { router } from 'expo-router'

import { useClearHistory } from '@/hooks/useClearHistory'
import { AUTHENTICATION_TOKENS_KEY } from '@/modules/auth/hooks/useAuthTokens'
import { useAuthStoreUpdateContext } from '@/modules/auth/state/useAuthStoreUpdateContext'
import { storage } from '@/utils/mmkv'

/**
 * Sign out, set AuthStore user to null and redirect to sign in page
 */
export const useSignOut = () => {
  const onAuthStoreUpdate = useAuthStoreUpdateContext()
  const clearHistory = useClearHistory()

  return async () => {
    try {
      onAuthStoreUpdate({ user: null })
      storage.delete(AUTHENTICATION_TOKENS_KEY)
      clearHistory()
      router.replace('/sign-in')
    } catch (error) {
      console.log('error signing out', error)
    }
  }
}
