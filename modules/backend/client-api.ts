import { environment } from '@/environment'

import { axiosInstance } from './axios-instance'
import { Configuration, MobileAppApiFactory, ScansAndOffencesApiFactory } from './openapi-generated'

const args = [{} as Configuration, environment.apiUrl, axiosInstance] as const

export const clientApi = {
  ...ScansAndOffencesApiFactory(...args),
  ...MobileAppApiFactory(...args),
}
