// eslint-disable-next-line import/extensions
import { colors } from './colors'

export const udrStyles = {
  lineActive: {
    lineColor: ['case', ['>=', ['get', 'price'], 2], colors.green, colors.lawnGreen],
    lineDasharray: [1, 0],
    lineWidth: ['interpolate', ['linear'], ['zoom'], 11, 1, 20, 3],
    lineOpacity: 0.4,
  },
  lineResidents: {
    lineColor: colors.lightBlue,
    lineDasharray: [1, 0],
    lineWidth: ['interpolate', ['linear'], ['zoom'], 11, 1, 20, 3],
    lineOpacity: 0.8,
  },
  lineSelected: {
    lineColor: colors.orange,
    lineDasharray: [1, 0],
    lineWidth: ['interpolate', ['linear'], ['zoom'], 11, 1, 20, 3],
    lineOpacity: 0.4,
  },
  zoneFillActive: {
    fillColor: ['case', ['>=', ['get', 'price'], 2], colors.green, colors.lawnGreen],
    fillOpacity: ['case', ['boolean', ['feature-state', 'hover'], false], 0.4, 0.2],
  },
  zoneFillResidents: {
    fillColor: colors.lightBlue,
    fillOpacity: 0.2,
  },
  zoneFillSelected: {
    fillColor: colors.orange,
    fillOpacity: 0.4,
  },
}

// image names registered by <Images> in MapSigns
const signIconImage = ['match', ['get', 'typ_znacky'], 'rezidenti', 'signRezidenti', 'signZona']

// zone code under the icon, hidden by Mapbox when it would collide with another label
const signLabel = {
  textField: ['get', 'label'],
  textSize: 11,
  textAnchor: 'top',
  textOffset: [0, 1.3],
  textColor: colors.dark,
  textHaloColor: colors.white,
  textHaloWidth: 1.5,
  textOptional: true,
}

export const signStyles = {
  cluster: {
    circleColor: colors.dark,
    circleRadius: ['step', ['get', 'point_count'], 14, 5, 17, 10, 20],
    circleStrokeColor: colors.white,
    circleStrokeWidth: 2.5,
  },
  clusterCount: {
    textField: ['get', 'point_count_abbreviated'],
    textSize: 13,
    textColor: colors.white,
    textAllowOverlap: true,
    textIgnorePlacement: true,
  },
  icon: {
    ...signLabel,
    iconImage: signIconImage,
    iconSize: ['interpolate', ['linear'], ['zoom'], 12, 0.75, 17, 1],
    // icons stay visible and tappable, clusters already keep them apart
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
  },
  // dark frame under the selected icon: visible on the orange zone highlight and in sunlight
  selectedFrame: {
    circleColor: colors.dark,
    circleOpacity: 0.2,
    circleRadius: 24,
    circleStrokeColor: colors.dark,
    circleStrokeWidth: 3,
  },
  selectedIcon: {
    ...signLabel,
    iconImage: signIconImage,
    iconSize: 1.25,
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
    textOffset: [0, 1.9],
    textAllowOverlap: true,
  },
}

// lighter zone highlight for the sign select screen, so the pins stay readable on top of it
export const zoneHighlightStyles = {
  fill: { fillColor: colors.orange, fillOpacity: 0.15 },
  line: { ...udrStyles.lineSelected, lineOpacity: 0.8 },
}
