import * as Location from 'expo-location'
import { Feature, Point } from 'geojson'

import { Arcgis } from '@/modules/arcgis/types'
import { calculateDistance } from '@/modules/map/utils/calculateDistance'
import { useArcgisStoreContext } from '@/state/ArcgisStore/useArcgisStoreContext'

type NearestSignType = Feature<Point, Arcgis.SignPoint> | null

export const useGetNearestSign = () => {
  const { signData } = useArcgisStoreContext()

  const getNearestSign = (coords?: Location.LocationObjectCoords): NearestSignType => {
    if (!(signData && coords)) return null

    let nearestSign: NearestSignType = null
    let minDistance = Infinity

    signData.features.forEach((feature) => {
      const [signLongitude, signLatitude] = feature.geometry.coordinates
      const distance = calculateDistance([
        signLatitude,
        signLongitude,
        coords.latitude,
        coords.longitude,
      ])

      if (distance < minDistance) {
        minDistance = distance
        nearestSign = feature
      }
    })

    return nearestSign
  }

  return { getNearestSign }
}
