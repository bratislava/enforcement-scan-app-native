import StoreVersionControl from '@/components/special/StoreVersionControl'
import { useAxiosResponseInterceptors } from '@/modules/backend/hooks/useAxiosResponseInterceptors'

/** A component that is always present and is inside all global providers */
const OmnipresentComponent = () => {
  useAxiosResponseInterceptors()

  return <StoreVersionControl />
}

export default OmnipresentComponent
