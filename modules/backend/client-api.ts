import { environment } from '@/environment'

import { axiosInstance } from './axios-instance'
import {
  Configuration,
  DefaultApiFactory,
  MobileAppApiFactory,
  ScansAndOffencesApiFactory,
} from './openapi-generated'

const args = [{} as Configuration, environment.apiUrl, axiosInstance] as const

export const clientApi = {
  ...DefaultApiFactory(...args),
  ...ScansAndOffencesApiFactory(...args),
  ...MobileAppApiFactory(...args),
}
