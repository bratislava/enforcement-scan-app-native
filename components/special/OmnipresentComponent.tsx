import { useAxiosResponseInterceptors } from '@/modules/backend/hooks/useAxiosResponseInterceptors'

/** A component that is always present and is inside all global providers */
const OmnipresentComponent = () => {
  useAxiosResponseInterceptors()

  return null
}

export default OmnipresentComponent
