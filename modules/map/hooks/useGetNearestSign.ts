import * as Location from 'expo-location'
import { Feature, Point } from 'geojson'
import { useCallback } from 'react'

import { Arcgis } from '@/modules/arcgis/types'
import { calculateDistance } from '@/modules/map/utils/calculateDistance'
import { getExpectedSignType } from '@/modules/map/utils/getExpectedSignType'
import { useArcgisStoreContext } from '@/state/ArcgisStore/useArcgisStoreContext'

type SignFeature = Feature<Point, Arcgis.SignPoint>
type NearestSignType = SignFeature | null

// a sign of the segment's own zone wins over a closer sign of another zone, up to this distance
const SAME_ZONE_MAX_DISTANCE_KM = 0.3

// distance in km, a few hundred signs make sorting cheap enough
const findNearest = (signs: SignFeature[], coords: Location.LocationObjectCoords) =>
  signs
    .map((sign) => {
      const [signLongitude, signLatitude] = sign.geometry.coordinates

      return {
        sign,
        distance: calculateDistance([
          signLatitude,
          signLongitude,
          coords.latitude,
          coords.longitude,
        ]),
      }
    })
    .sort((a, b) => a.distance - b.distance)[0] ?? null

export const useGetNearestSign = () => {
  const { signData } = useArcgisStoreContext()

  /**
   * Find the sign nearest to the given position that matches the segment's sign type
   *
   * When a zone code is given, the nearest sign of that zone is preferred if it is not further
   * than SAME_ZONE_MAX_DISTANCE_KM; otherwise the nearest sign of the right type is returned.
   *
   * @param coords position to measure from
   * @param udrId UDR ID of the segment, decides between zone and resident signs
   * @param zoneCode zone code of the segment (e.g. "SM1") whose signs are preferred
   * @returns the nearest matching sign, or null without sign data or position
   */
  const getNearestSign = useCallback(
    (
      coords?: Location.LocationObjectCoords,
      udrId?: string,
      zoneCode?: string,
    ): NearestSignType => {
      if (!(signData && coords)) return null

      const expectedType = getExpectedSignType(udrId)
      const typeSigns = signData.features.filter(
        (feature) => feature.properties.typ_znacky === expectedType,
      )

      const preferredZone = zoneCode?.trim()
      if (preferredZone) {
        const sameZone = findNearest(
          typeSigns.filter((feature) => feature.properties.zona?.trim() === preferredZone),
          coords,
        )
        if (sameZone && sameZone.distance <= SAME_ZONE_MAX_DISTANCE_KM) return sameZone.sign
      }

      return findNearest(typeSigns, coords)?.sign ?? null
    },
    [signData],
  )

  return { getNearestSign }
}
