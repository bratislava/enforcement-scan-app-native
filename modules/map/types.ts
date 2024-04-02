/* eslint-disable babel/camelcase */

import { Feature, MultiPolygon, Polygon } from 'geojson'

import { GeocodingFeature } from '@/modules/arcgis/types'
import { MapLayerEnum, MapZoneStatusEnum } from '@/modules/map/constants'

export type MapUdrZone = {
  /** OBJECTID */
  id: number
  name: string
  price: number
  weekendsAndHolidaysPrice: number
  paidHours: string
  parkingDurationLimit: number
  additionalInformation: string
  rpkInformation: string
  npkInformation: string
  code: string
  status: MapZoneStatusEnum
  udrId: string
  udrUuid: string
  odpRpk: string
  restrictionOnlyRpk: string
  cityDistrict: string
  reservedParking: string
  initialFreeParkingDuration: number
  parkingDurationRestrictionException: string
  parkingFeeException: string
  layer: MapLayerEnum
}

export const isGeocodingFeature = (
  value: GeocodingFeature | UdrZoneFeature,
): value is GeocodingFeature => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  return (value as any)?.place_name !== undefined
}

export type UdrZoneFeature = Feature<Polygon | MultiPolygon, MapUdrZoneWithTranslationProps>

export type ApplicationLocale = 'sk' | 'en'

export type TranslationProperty<T> = {
  [key in ApplicationLocale]: T
}

/**
 * @param K Keys of properties that have a translation translated
 */
export type WithTranslationProperties<P, K extends keyof P> = {
  [Property in keyof P as Property extends K ? Property : never]:
    | P[Property]
    | TranslationProperty<P[Property]>
} & {
  [Property in keyof P as Property extends K ? never : Property]: P[Property]
}

export type MapUdrZoneWithTranslationProps = WithTranslationProperties<
  MapUdrZone,
  'paidHours' | 'additionalInformation' | 'rpkInformation' | 'npkInformation' | 'reservedParking'
>
