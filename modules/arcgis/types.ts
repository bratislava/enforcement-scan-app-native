/* eslint-disable babel/camelcase */

import { FeatureCollection, GeoJsonTypes, Geometry, Polygon } from 'geojson'

import { ArcgisAliased } from '@/modules/arcgis/aliasedTypes'
import { MapZoneStatusEnum } from '@/modules/map/constants'

export type GeocodingFeature = {
  id: string
  type: GeoJsonTypes
  place_type: (
    | 'country'
    | 'region'
    | 'postcode'
    | 'district'
    | 'place'
    | 'locality'
    | 'neighborhood'
    | 'address'
    | 'poi'
  )[]
  relevance: number // 0 -> 1
  address?: string // house number for place_type 'address'
  properties: {
    accuracy?: 'rooftop' | 'parcel' | 'point' | 'interpolated' | 'intersection' | 'street'
    address?: string // for place_type 'poi'
    category?: string
    maki?: string
    wikidata?: string
    short_code?: string
  }
  text: string
  place_name: string
  matching_text?: string
  matching_place_name?: string
  bbox: number[]
  center: [number, number]
  geometry: Geometry
  routable_points?: {
    points?: { coordinates: [number, number] }[] | null
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Arcgis {
  export type UdrZone = {
    OBJECTID: number
    Nazov: string
    Zakladna_cena: number // 2
    Cas_spoplatnenia_en: string // "8-24"
    Cas_spoplatnenia_sk: string // "8-24"
    Casove_obmedzenie_dlzky_park: number // 0
    Doplnkova_informacia_en: string // "Bonus parking card cannot be used in this segment"
    Doplnkova_informacia_sk: string // "V tomto úseku nie je možné využiť bonusovú parkovaciu kartu"
    GlobalID: string // Uuid
    Informacia_RPK_sk: string
    Informacia_RPK_en: string
    Informacia_NPK_sk: string
    Informacia_NPK_en: string
    Kod_rezidentskej_zony: string // "SM0"
    Status: MapZoneStatusEnum // "active"
    UDR_ID: number // 1027
    ODP_RPKAPK: string // "SM0"
    Obmedzene_len_pre_RPK_APK: string // "N/A"
    UTJ: string // "Staré Mesto"
    Uvodny_bezplatny_cas_parkovan: number // 0
    Vyhradene_park_statie_en: string // "public"
    Vyhradene_park_statie_sk: string // ""verejné""
    Vynimka_z_obmedzenia_dlzky_pa: string // "N/A"
    Vynimka_zo_spoplatnenia: string // "0-24"
    export_partneri: string // "ano"
    layer: string // "visitors"
    vikendy_a_sviatky: number // 1
    web: string // "ano"
  }

  export interface RawData {
    rawUdrData?: FeatureCollection<Polygon, UdrZone>
  }
}

export interface ArcgisData {
  rawUdrData: FeatureCollection<Polygon, Arcgis.UdrZone | ArcgisAliased.UdrZone>
}
