import { useContext } from 'react'

import { ArcgisStoreContext } from '@/state/ArcgisStore/ArcgisStoreProvider'

export const useArcgisStoreContext = () => {
  const context = useContext(ArcgisStoreContext)

  if (!context) {
    throw new Error('useArcgisStoreContext must be used within a ArcgisStoreProvider')
  }

  return context
}
