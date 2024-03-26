import { TokenResponse } from 'expo-auth-session'
import { useMMKVObject } from 'react-native-mmkv'

export const AUTHENTICATION_TOKENS_KEY = 'authentication_tokens'
export const AUTH_SCOPES = ['openid', 'offline_access', 'email']

export const useAuthTokens = () => useMMKVObject<TokenResponse | null>(AUTHENTICATION_TOKENS_KEY)
