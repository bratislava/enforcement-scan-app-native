import { createContext, ReactNode, useRef } from 'react'

import { OffenceTypeEnum, ResolutionOffenceTypeEnum } from '@/modules/backend/openapi-generated'
import { MapUdrZoneWithTranslationProps } from '@/modules/map/types'
import { createStore, Store } from '@/utils/store'

export type ZonePhoto = {
  id: number
  photoUrl: string
}

export type OffenceState = {
  roleKey?: string
  ecv?: string
  zone?: MapUdrZoneWithTranslationProps
  zonePhoto?: ZonePhoto
  location?: {
    lat: number
    lon: number
  }
  offencePhotos?: string[]
  offenceType?: OffenceTypeEnum
  resolutionType?: ResolutionOffenceTypeEnum
  isObjectiveResponsibility?: boolean
}

const defaultState: OffenceState = {
  isObjectiveResponsibility: true,
}

export const OffenceStoreContext = createContext<Store<OffenceState>>(
  createStore<OffenceState>(defaultState),
)

export const OffenceStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<Store<OffenceState>>()
  if (!storeRef.current) {
    storeRef.current = createStore<OffenceState>(defaultState)
  }

  return (
    <OffenceStoreContext.Provider value={storeRef.current}>{children}</OffenceStoreContext.Provider>
  )
}
