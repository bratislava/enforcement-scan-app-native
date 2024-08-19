/* eslint-disable eslint-comments/no-unlimited-disable,unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import { UdrZoneFeature, MapUdrZoneWithTranslationProps } from '@/modules/map/types'
import { MapLayerEnum } from '@/modules/map/constants'
import { normalizeZone } from '@/modules/map/utils/normalizeZone'
import { Arcgis, ArcgisData } from '@/modules/arcgis/types'
import { ArcgisAliased } from '@/modules/arcgis/aliasedTypes'
import { normalizeAliasedZone } from '@/modules/map/utils/normalizeAliasedZone'
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson'

const zoneMapping = {
  SM1: 'SM1',
  NM1a: 'NM1',
  RU1: 'RU1',
  RA1: 'RA1',
  'PE1-Dvory IV': 'PE1',
} as { [key: string]: string }

export const processData = ({ rawUdrData }: ArcgisData) => {
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

  return { udrData }
}
