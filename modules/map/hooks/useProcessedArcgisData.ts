import { useEffect, useState } from 'react'

import { useStaticArcgisData } from '@/modules/arcgis/hooks/useStaticArcgisData'
import { ArcgisData } from '@/modules/arcgis/types'
import { processData } from '@/modules/map/utils/processData'

type ProcessDataReturn = ReturnType<typeof processData>

export type ProcessedMapData = Omit<ReturnType<typeof useProcessedArcgisData>, 'isLoading'>

export const useProcessedArcgisData = () => {
  const [isLoading, setLoading] = useState(true)
  const [udrData, setUdrData] = useState<ProcessDataReturn['udrData'] | null>(null)
  const [isProcessingFinished, setIsProcessingFinished] = useState(false)

  const { rawUdrData }: Partial<ArcgisData> = useStaticArcgisData()

  useEffect(() => {
    if (rawUdrData) {
      if (isProcessingFinished) return

      const { udrData: processedUdrData } = processData({ rawUdrData })

      setUdrData(processedUdrData)
      setLoading(false)

      setIsProcessingFinished(true)
    }
  }, [rawUdrData, isProcessingFinished])

  return { isLoading, udrData }
}
