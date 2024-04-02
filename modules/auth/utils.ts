import { TokenResponse } from 'expo-auth-session'
import { jwtDecode } from 'jwt-decode'

import { User } from '@/modules/auth/types'

export const getUserFromTokens = (tokens: TokenResponse): User => {
  const { accessToken } = tokens

  const accessTokenUser: {
    name: string
    // eslint-disable-next-line babel/camelcase
    preferred_username: string
    roles: string[]
  } = jwtDecode(accessToken)

  return {
    name: accessTokenUser.name,
    email: accessTokenUser.preferred_username,
    roles: accessTokenUser.roles || [],
  }
}
