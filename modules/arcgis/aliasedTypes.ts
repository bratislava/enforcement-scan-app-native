/* eslint-disable babel/camelcase */

import { FeatureCollection, GeoJsonProperties, MultiPolygon, Polygon } from 'geojson'

import { MapZoneStatusEnum } from '@/modules/map/constants'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ArcgisAliased {
  export type UdrZone = {
    OBJECTID: number
    Shape: Polygon | MultiPolygon
    'Mestská časť': string
    'Kód rezidentskej zóny': string
    Názov: string
    'UDR ID': number
    'Cena (eur/h)': number
    'ODP Platnosť RPK a APK': string
    'Časové obmedzenie dĺžky parkovania (min)': number
    'Obmedzené len pre RPK, APK': string
    'Úvodný bezplatný čas parkovania (min)': number
    'Výnimka zo spoplatnenia (RPK, APK)': string
    'Vyhradené parkovacie státie (sk)': string
    'Vyhradené parkovacie státie (en)': string
    'Výnimka z obmedzenia dĺžky parkovania (RPK, APK)': string
    GlobalID: string
    GlobalID_A: string
    Status: MapZoneStatusEnum
    Obvod: number
    Plocha: number
    web: string
    'export partneri': string
    'Informácia RPK (sk)': string
    'Informácia RPK (en)': string
    'Informácia NPK (sk)': string
    'Informácia NPK (en)': string
    'Čas spoplatnenia (sk)': string
    'Čas spoplatnenia (en)': string
    'Doplnková informácia (sk)': string
    'Doplnková informácia (en)': string
    'Víkendy a sviatky': number
    layer: string // "visitors"
  }

  export interface RawData {
    rawUdrData?: FeatureCollection<Polygon, UdrZone>
    rawZonesData?: FeatureCollection<Polygon, GeoJsonProperties>
  }
}
