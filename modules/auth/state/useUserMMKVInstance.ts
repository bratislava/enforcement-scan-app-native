import { useMMKV } from 'react-native-mmkv'

import { useAuthStoreContext } from '@/modules/auth/state/useAuthStoreContext'

export const useUserMMKVInstance = () => {
  const { user } = useAuthStoreContext()

  return useMMKV({ id: user ? `${user?.username}.storage` : 'mmkv.default' })
}
