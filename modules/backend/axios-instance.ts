import axios from 'axios'

import { APP_VERSION } from '@/components/info/AppVersion'
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
    request.headers.Version = APP_VERSION
  }

  console.log('fetching:', request.url)

  return request
})
