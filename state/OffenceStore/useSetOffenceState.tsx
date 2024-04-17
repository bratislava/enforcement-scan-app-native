import { useCallback, useContext } from 'react'

import { OffenceState, OffenceStoreContext } from '@/state/OffenceStore/OffenceStoreProvider'

export const useSetOffenceState = () => {
  const { setState } = useContext(OffenceStoreContext)

  const setOffenceState = useCallback(
    (newState: Partial<OffenceState>) => setState((prev) => ({ ...prev, ...newState })),
    [setState],
  )

  const resetOffenceState = useCallback((newState: OffenceState) => setState(newState), [setState])

  return { setOffenceState, resetOffenceState }
}
