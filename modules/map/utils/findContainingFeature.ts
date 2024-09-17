import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

import { UdrZoneFeature } from '@/modules/map/types'

export const findContainingFeature = (
  features: UdrZoneFeature[],
  coordinates: [number, number],
): UdrZoneFeature | null => {
  const containingFeature = features.find((feature) => {
    if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
      return booleanPointInPolygon(coordinates, feature)
    }

    return false
  })

  if (containingFeature) {
    return containingFeature
  }

  return null
}
