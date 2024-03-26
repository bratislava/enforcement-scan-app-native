import { useAutoDiscovery } from 'expo-auth-session'

import { environment } from '@/environment'

/**
 * Use the auto discovery to get the discovery document
 * https://docs.expo.dev/guides/authentication/#azure
 */
export const useDiscovery = () =>
  useAutoDiscovery(`https://login.microsoftonline.com/${environment.tenantId}/v2.0`)
