import { environment } from '@/environment'

import { axiosInstance } from './axios-instance'
import {
  Configuration,
  DefaultApiFactory,
  ScannersAndOffencesApiFactory,
} from './openapi-generated'

const args = [{} as Configuration, environment.apiUrl, axiosInstance] as const

export const clientApi = {
  ...DefaultApiFactory(...args),
  ...ScannersAndOffencesApiFactory(...args),
}
