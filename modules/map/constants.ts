/* eslint-disable pii/no-phone-number, unicorn/numeric-separators-style */
export const MAP_INSETS = {
  top: 40,
  right: 0,
  bottom: 0,
  left: 10,
}

export enum MapLayerEnum {
  zones = 'zones',
  visitors = 'visitors',
  residents = 'residents',
}

export enum MapZoneStatusEnum {
  active = 'active',
  inactive = 'inactive',
  planned = 'planned',
}

export const MAP_CENTER = [17.1110118, 48.1512015] // Bratislava
export const CITY_BOUNDS = {
  sw: [16.95716298676959, 48.02126829091361], // south-west corner
  ne: [17.28590508163896, 48.26473441916502], // north-east corner
}
export const MAP_STYLE_URL = 'mapbox://styles/inovaciebratislava/cl5teyncz000614o4le1p295o'
export const LOCATION_PREVIEW_DEFAULT_ZOOM = 18
