import { createContext, ReactNode, useRef } from 'react'

import {
  ResolutionOffenceTypeEnum,
  ResponseCreateOrUpdateScanDto,
} from '@/modules/backend/openapi-generated'
import { MapUdrZoneWithTranslationProps } from '@/modules/map/types'
import { defaultOffenceState } from '@/state/OffenceStore/constants'
import { createStore, Store } from '@/utils/store'

export type ZonePhoto = {
  id: number
  photoUrl?: string | null
  tag?: string | null
}

export type PositionObject = {
  lat: number
  long: number
}

export type OffenceState = {
  roleKey?: string
  ecv?: string
  scanData?: ResponseCreateOrUpdateScanDto
  ecvUpdatedManually?: boolean

  // offence data
  location?: PositionObject
  offenceType?: string
  resolutionType?: ResolutionOffenceTypeEnum
  isObjectiveResponsibility: boolean
  offenceDate?: Date

  photos: string[]

  // zone data
  zone?: MapUdrZoneWithTranslationProps
  zonePhoto?: ZonePhoto

  // vehicle data
  vehicleId?: number
}

export const OffenceStoreContext = createContext<Store<OffenceState>>(
  createStore<OffenceState>(defaultOffenceState),
)

export const OffenceStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<Store<OffenceState>>(null)
  if (!storeRef.current) {
    storeRef.current = createStore<OffenceState>(defaultOffenceState)
  }

  return (
    <OffenceStoreContext.Provider value={storeRef.current}>{children}</OffenceStoreContext.Provider>
  )
}
