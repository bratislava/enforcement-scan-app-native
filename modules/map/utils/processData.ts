/* eslint-disable eslint-comments/no-unlimited-disable,unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import area from '@turf/area'
import booleanIntersects from '@turf/boolean-intersects'
import { Polygon } from '@turf/helpers'
import intersect from '@turf/intersect'
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import { UdrZoneFeature, MapUdrZoneWithTranslationProps } from '@/modules/map/types'
import { MapLayerEnum } from '@/modules/map/constants'
import { normalizeZone } from '@/modules/map/utils/normalizeZone'
import { Arcgis, ArcgisData } from '@/modules/arcgis/types'
import { ArcgisAliased } from '@/modules/arcgis/aliasedTypes'
import { normalizeAliasedZone } from '@/modules/map/utils/normalizeAliasedZone'

const zoneMapping = {
  SM1: 'SM1',
  NM1a: 'NM1',
  RU1: 'RU1',
  RA1: 'RA1',
  'PE1-Dvory IV': 'PE1',
} as { [key: string]: string }

export const getIntersectionOfFeatureFromFeatures = <G extends Geometry>(
  feature: Feature<G>,
  featureCollection: FeatureCollection<Polygon>,
) => {
  const availableFeatures = featureCollection.features

  for (const availableFeature of availableFeatures) {
    if (feature.geometry.type === 'Polygon') {
      const intersection = intersect(
        {
          type: 'FeatureCollection',
          features: [availableFeature],
        },
        feature as Feature<Polygon>,
      )

      if (!intersection) {
        continue
      }

      if (area(intersection) > area(feature) / 2) {
        return availableFeature
      }
    }

    if (feature.geometry.type === 'Point' && booleanIntersects(availableFeature, feature)) {
      return availableFeature
    }
  }

  return null
}

export const addZonePropertyToLayer = <G extends Geometry, GJP extends GeoJsonProperties>(
  featureCollection: FeatureCollection<G, GJP>,
  zonesCollection: FeatureCollection<Polygon>,
): FeatureCollection<G, GJP> => ({
  ...featureCollection,
  features: featureCollection.features.map((feature) => {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        zone: getIntersectionOfFeatureFromFeatures(feature, zonesCollection)?.properties?.zone,
      },
    }
  }),
})

export const processData = ({ rawZonesData, rawUdrData }: ArcgisData) => {
  let GLOBAL_ID = 0
  const isUsingAliasedData = rawUdrData.features.find((udr) =>
    Object.hasOwn(udr.properties, 'UDR ID'),
  )

  const localNormalizeZone:
    | ((zone: Arcgis.UdrZone) => MapUdrZoneWithTranslationProps)
    | ((zone: ArcgisAliased.UdrZone) => MapUdrZoneWithTranslationProps) = isUsingAliasedData
    ? normalizeAliasedZone
    : normalizeZone

  const zonesData = {
    type: 'FeatureCollection',
    features: rawZonesData.features
      .map((feature) => {
        GLOBAL_ID++
        const layer = 'zones'

        return {
          ...feature,
          id: GLOBAL_ID,
          properties: {
            ...feature.properties,
            layer,
            zone: zoneMapping[feature.properties?.Kod_parkovacej_karty],
          },
        } as Feature<Polygon>
      })
      .filter((z) => z.properties?.zone && z.properties.Dátum_spustenia),
  }

  const udrData = addZonePropertyToLayer(
    {
      type: 'FeatureCollection',
      features: rawUdrData.features
        .filter((f) => f.properties?.web === 'ano' || f.properties?.web === 'ano - planned')
        .map((feature) => {
          GLOBAL_ID++
          const layer = MapLayerEnum.visitors
          const properties = {
            ...feature.properties,
            layer,
          }
          const normalizedProperties = localNormalizeZone(properties as any)

          return {
            ...feature,
            id: GLOBAL_ID,
            properties: normalizedProperties,
          } as UdrZoneFeature
        }),
    } as FeatureCollection<Polygon, MapUdrZoneWithTranslationProps>,
    zonesData as FeatureCollection<Polygon, MapUdrZoneWithTranslationProps>,
  )

  return {
    udrData,
    zonesData,
  }
}
