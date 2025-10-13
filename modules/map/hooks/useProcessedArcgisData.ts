import { useEffect, useState } from 'react'

import { useStaticArcgisData } from '@/modules/arcgis/hooks/useStaticArcgisData'
import { ArcgisData } from '@/modules/arcgis/types'
import { processData } from '@/modules/map/utils/processData'

type ProcessDataReturn = ReturnType<typeof processData>

export type ProcessedMapData = Omit<ReturnType<typeof useProcessedArcgisData>, 'isLoading'>

export const useProcessedArcgisData = () => {
  const [isLoading, setLoading] = useState(true)
  const [udrData, setUdrData] = useState<ProcessDataReturn['udrData'] | null>(null)
  const [signData, setSignData] = useState<ProcessDataReturn['signData'] | null>(null)
  const [isProcessingFinished, setIsProcessingFinished] = useState(false)

  const { rawUdrData, rawSignData }: Partial<ArcgisData> = useStaticArcgisData()

  useEffect(() => {
    if (rawUdrData && rawSignData) {
      if (isProcessingFinished) return

      const { udrData: processedUdrData, signData: processedSignData } = processData({
        rawUdrData,
        rawSignData,
      })

      setUdrData(processedUdrData)
      setSignData(processedSignData)
      setLoading(false)

      setIsProcessingFinished(true)
    }
  }, [rawUdrData, rawSignData, isProcessingFinished])

  return { isLoading, udrData, signData }
}
