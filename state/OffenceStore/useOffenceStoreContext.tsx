import { useContext, useSyncExternalStore } from 'react'

import { OffenceState, OffenceStoreContext } from '@/state/OffenceStore/OffenceStoreProvider'

export const useOffenceStoreContext = <S,>(selector: (state: OffenceState) => S): S => {
  const store = useContext(OffenceStoreContext)

  return useSyncExternalStore(store.subscribe, () => selector(store.getState()))
}
