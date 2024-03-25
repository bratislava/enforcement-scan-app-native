import { useContext } from 'react'

import { OffenceState, OffenceStoreContext } from '@/state/OffenceStore/OffenceStoreProvider'

export const useSetOffenceState = () => {
  const store = useContext(OffenceStoreContext)

  return (newState: OffenceState) => store.setState((prev) => ({ ...prev, ...newState }))
}
