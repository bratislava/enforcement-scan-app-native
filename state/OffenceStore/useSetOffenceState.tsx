import { useContext } from 'react'

import { OffenceState, OffenceStoreContext } from '@/state/OffenceStore/OffenceStoreProvider'

export const useSetOffenceState = () => {
  const store = useContext(OffenceStoreContext)

  return (newState: OffenceState, { merge = true } = {}) =>
    store.setState((prev) => (merge ? { ...prev, ...newState } : newState))
}
