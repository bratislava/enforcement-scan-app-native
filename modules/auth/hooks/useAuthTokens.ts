import { TokenResponse } from 'expo-auth-session'
import { useMMKVObject } from 'react-native-mmkv'

import { environment } from '@/environment'

export const AUTHENTICATION_TOKENS_KEY = 'authentication_tokens'
export const AUTH_SCOPES = [
  `api://${environment.clientId}/user_auth`,
  'user.read',
  'offline_access',
]

const baseOauth2Url = `https://login.microsoftonline.com/${environment.tenantId}/oauth2/v2.0`

export const discovery = {
  authorizationEndpoint: `${baseOauth2Url}/authorize`,
  tokenEndpoint: `${baseOauth2Url}/token`,
}

export const useAuthTokens = () => useMMKVObject<TokenResponse | null>(AUTHENTICATION_TOKENS_KEY)
