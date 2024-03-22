import { useContext } from 'react'

import { MapStoreUpdateContext } from '@/modules/map/state/MapStoreProvider/MapStoreProvider'

export const useMapStoreUpdateContext = () => {
  const context = useContext(MapStoreUpdateContext)

  if (!context) {
    throw new Error('useMapStoreContext must be used within a MapStoreProvider')
  }

  return context
}
