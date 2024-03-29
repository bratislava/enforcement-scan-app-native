import { createContext, ReactNode, useRef } from 'react'

import { MapUdrZoneWithTranslationProps } from '@/modules/map/types'
import { createStore, Store } from '@/utils/store'

export type OffenceState = {
  role?: string
  ecv?: string
  zone?: MapUdrZoneWithTranslationProps
  zonePhoto?: string
  location?: {
    lat: number
    lon: number
  }
  offencePhotos?: string[]
  offenceType?: string
}

export const OffenceStoreContext = createContext<Store<OffenceState>>(createStore<OffenceState>({}))

export const OffenceStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<Store<OffenceState>>()
  if (!storeRef.current) {
    storeRef.current = createStore<OffenceState>({})
  }

  return (
    <OffenceStoreContext.Provider value={storeRef.current}>{children}</OffenceStoreContext.Provider>
  )
}
