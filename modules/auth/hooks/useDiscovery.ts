import { useAutoDiscovery } from 'expo-auth-session'

import { environment } from '@/environment'

export const useDiscovery = () =>
  useAutoDiscovery(`https://login.microsoftonline.com/${environment.tenantId}/v2.0`)
