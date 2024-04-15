import { createContext, PropsWithChildren } from 'react'

import { useProcessedArcgisData } from '@/modules/map/hooks/useProcessedArcgisData'

export const ArcgisStoreContext = createContext<ReturnType<typeof useProcessedArcgisData> | null>(
  null,
)

const ArcgisStoreProvider = ({ children }: PropsWithChildren) => {
  const data = useProcessedArcgisData()

  return <ArcgisStoreContext.Provider value={data}>{children}</ArcgisStoreContext.Provider>
}

export default ArcgisStoreProvider
