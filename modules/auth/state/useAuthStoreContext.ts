import { useContext } from 'react'

import { AuthStoreContext } from '@/modules/auth/state/AuthStoreProvider'

export const useAuthStoreContext = () => {
  const context = useContext(AuthStoreContext)

  if (!context) {
    throw new Error('useAuthStoreContext must be used within a AuthStoreProvider')
  }

  return context
}
