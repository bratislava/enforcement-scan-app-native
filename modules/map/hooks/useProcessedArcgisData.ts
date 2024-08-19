import { useEffect, useState } from 'react'

import { useStaticArcgisData } from '@/modules/arcgis/hooks/useStaticArcgisData'
import { ArcgisData } from '@/modules/arcgis/types'
import { processData } from '@/modules/map/utils/processData'

type ProcessDataReturn = ReturnType<typeof processData>

export type ProcessedMapData = Omit<ReturnType<typeof useProcessedArcgisData>, 'isLoading'>

export const useProcessedArcgisData = () => {
  const [isLoading, setLoading] = useState(true)
  const [zonesData, setZonesData] = useState<ProcessDataReturn['zonesData'] | null>(null)
  const [udrData, setUdrData] = useState<ProcessDataReturn['udrData'] | null>(null)
  const [isProcessingFinished, setIsProcessingFinished] = useState(false)

  const { rawZonesData, rawUdrData }: Partial<ArcgisData> = useStaticArcgisData()

  useEffect(() => {
    if (rawUdrData && rawZonesData) {
      if (isProcessingFinished) return
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { udrData, zonesData } = processData({
        rawZonesData,
        rawUdrData,
      })

      setZonesData(zonesData)
      setUdrData(udrData)
      setLoading(false)

      setIsProcessingFinished(true)
    }
  }, [rawUdrData, rawZonesData, isProcessingFinished])

  return { isLoading, zonesData, udrData }
}
