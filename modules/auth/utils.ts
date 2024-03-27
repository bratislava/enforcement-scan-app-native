import { TokenResponse } from 'expo-auth-session'
import { jwtDecode } from 'jwt-decode'

import { User } from '@/modules/auth/types'

export const getUserFromTokens = (tokens: TokenResponse): User => {
  const { accessToken, idToken } = tokens

  const accessTokenUser: {
    name: string
  } = jwtDecode(accessToken)
  const idTokenUser: { roles?: string[]; email: string } = jwtDecode(idToken || '')

  return {
    name: accessTokenUser.name,
    email: idTokenUser?.email,
    roles: idTokenUser?.roles || [],
  }
}
