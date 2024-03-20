import { useEffect, useState } from 'react'

import { useStaticArcgisData } from '@/modules/arcgis/hooks/useStaticArcgisData'
import { ArcgisData } from '@/modules/arcgis/types'
import { processData } from '@/modules/map/utils/processData'
import { MapFeatureHashMap } from '@/state/MapZonesProvider/types'
import { useMapZonesUpdateContext } from '@/state/MapZonesProvider/useMapZonesUpdateContext'

type ProcessDataReturn = ReturnType<typeof processData>

export type ProcessedMapData = Omit<ReturnType<typeof useProcessedArcgisData>, 'isLoading'>

export const useProcessedArcgisData = () => {
  const [isLoading, setLoading] = useState(true)
  const [zonesData, setZonesData] = useState<ProcessDataReturn['zonesData'] | null>(null)
  const [udrData, setUdrData] = useState<ProcessDataReturn['udrData'] | null>(null)
  const [odpData, setOdpData] = useState<ProcessDataReturn['odpData'] | null>(null)
  const [isProcessingFinished, setIsProcessingFinished] = useState(false)

  const setMapZones = useMapZonesUpdateContext()

  const { rawZonesData, rawUdrData, rawOdpData }: Partial<ArcgisData> = useStaticArcgisData()

  useEffect(() => {
    if (rawUdrData && rawOdpData && rawZonesData) {
      if (isProcessingFinished) return
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { udrData, odpData, zonesData } = processData({
        rawZonesData,
        rawUdrData,
        rawOdpData,
      })
      setZonesData(zonesData)
      setUdrData(udrData)
      setOdpData(odpData)
      setLoading(false)

      const featuresHashMap: MapFeatureHashMap = new Map()
      udrData.features.forEach((feature) => {
        if (feature.properties) {
          featuresHashMap.set(feature.properties.udrId.toString(), feature)
        }
      })
      setMapZones(featuresHashMap)
      setIsProcessingFinished(true)
    }
  }, [rawUdrData, rawOdpData, rawZonesData, setMapZones, isProcessingFinished])

  return { isLoading, zonesData, udrData, odpData }
}
