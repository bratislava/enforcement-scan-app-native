import { Feature, FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson'

import { MapUdrZoneWithTranslationProps } from '@/modules/map/types'

type ZoneFeatureCollection = FeatureCollection<
  Polygon | MultiPolygon,
  MapUdrZoneWithTranslationProps
>

export type ZoneArea = {
  featureCollection: ZoneFeatureCollection
  bounds: { ne: Position; sw: Position }
}

const getRings = (feature: Feature<Polygon | MultiPolygon>): Position[][] =>
  feature.geometry.type === 'Polygon'
    ? feature.geometry.coordinates
    : feature.geometry.coordinates.flat()

/**
 * Get all segments (úseky) that share the zone code of the selected segment and their bounding box.
 *
 * Zone signs belong to the whole zone (e.g. "SM1"), not to a single segment, so the whole zone is
 * returned. Falls back to the selected segment alone when the zone has no code.
 *
 * @param udrData all segments loaded from ArcGIS
 * @param zone the selected segment
 * @returns segments of the zone with their bounds, or null when no matching segment is found
 */
export const getZoneArea = (
  udrData: ZoneFeatureCollection,
  zone: MapUdrZoneWithTranslationProps,
): ZoneArea | null => {
  const zoneCode = zone.code?.trim()

  const features = udrData.features.filter((feature) =>
    zoneCode ? feature.properties.code?.trim() === zoneCode : feature.properties.id === zone.id,
  )

  if (features.length === 0) return null

  let [minLon, minLat, maxLon, maxLat] = [Infinity, Infinity, -Infinity, -Infinity]

  features.forEach((feature) => {
    getRings(feature).forEach((ring) => {
      ring.forEach(([lon, lat]) => {
        minLon = Math.min(minLon, lon)
        minLat = Math.min(minLat, lat)
        maxLon = Math.max(maxLon, lon)
        maxLat = Math.max(maxLat, lat)
      })
    })
  })

  return {
    featureCollection: { ...udrData, features },
    bounds: { ne: [maxLon, maxLat], sw: [minLon, minLat] },
  }
}
