import axios from 'axios'

import { AUTHENTICATION_TOKENS_KEY } from '@/modules/auth/hooks/useAuthTokens'
import { storage } from '@/utils/mmkv'

export const axiosInstance = axios.create()

declare module 'axios' {
  interface AxiosRequestConfig {
    accessToken?: string | null
  }
}

axiosInstance.interceptors.request.use(async (request) => {
  const tokens = JSON.parse(storage.getString(AUTHENTICATION_TOKENS_KEY) || '{}')

  if (tokens?.accessToken) {
    request.headers.Authorization = `Bearer ${tokens.accessToken}`
  }

  console.log('fetching:', request.url)

  return request
})
