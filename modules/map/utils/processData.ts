/* eslint-disable eslint-comments/no-unlimited-disable,unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import { ArcgisAliased } from '@/modules/arcgis/aliasedTypes'
import { Arcgis, ArcgisData } from '@/modules/arcgis/types'
import { MapLayerEnum } from '@/modules/map/constants'
import { MapUdrZoneWithTranslationProps, UdrZoneFeature } from '@/modules/map/types'
import { normalizeAliasedZone } from '@/modules/map/utils/normalizeAliasedZone'
import { normalizeZone } from '@/modules/map/utils/normalizeZone'
import { FeatureCollection, MultiPolygon, Point, Polygon } from 'geojson'

export const processData = ({ rawUdrData, rawSignData }: ArcgisData) => {
  let GLOBAL_ID = 0
  const isUsingAliasedData = rawUdrData.features.find((udr) =>
    Object.hasOwn(udr.properties, 'UDR ID'),
  )

  const localNormalizeZone:
    | ((zone: Arcgis.UdrZone) => MapUdrZoneWithTranslationProps)
    | ((zone: ArcgisAliased.UdrZone) => MapUdrZoneWithTranslationProps) = isUsingAliasedData
    ? normalizeAliasedZone
    : normalizeZone

  const udrData = {
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
  } as FeatureCollection<Polygon | MultiPolygon, MapUdrZoneWithTranslationProps>

  const signData = {
    type: 'FeatureCollection',
    features: rawSignData.features.map((feature) => {
      return {
        ...feature,
        id: feature.properties.OBJECTID,
      }
    }),
  } as FeatureCollection<Point, Arcgis.SignPoint>

  return { udrData, signData }
}
