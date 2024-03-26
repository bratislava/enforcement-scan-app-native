import axios from 'axios'

import { useAuthTokens } from '@/modules/auth/hooks/useAuthTokens'

export const axiosInstance = axios.create()

// TODO redirect on logout

declare module 'axios' {
  interface AxiosRequestConfig {
    accessToken?: string | null
  }
}

axiosInstance.interceptors.request.use(async (request) => {
  const [tokens] = useAuthTokens()

  if (tokens?.accessToken) {
    request.headers.Authorization = `Bearer ${tokens.accessToken}`
  }

  console.log('fetching:', request.url)

  return request
})
