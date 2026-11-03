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

export const signStyles = {
  circle: {
    // sign color matches the color of the zone type it belongs to
    circleColor: ['match', ['get', 'typ_znacky'], 'rezidenti', colors.lightBlue, colors.green],
    circleRadius: ['interpolate', ['linear'], ['zoom'], 12, 5, 18, 10],
    circleStrokeColor: colors.white,
    circleStrokeWidth: 2,
  },
  // dark ring drawn below the selected pin: visible on the orange zone highlight and in sunlight,
  // and it does not hide neighbouring pins, which are drawn on top of it
  circleSelected: {
    circleColor: colors.dark,
    circleOpacity: 0.25,
    circleRadius: ['interpolate', ['linear'], ['zoom'], 12, 11, 18, 18],
    circleStrokeColor: colors.dark,
    circleStrokeWidth: 3,
  },
}

// lighter zone highlight for the sign select screen, so the pins stay readable on top of it
export const zoneHighlightStyles = {
  fill: { fillColor: colors.orange, fillOpacity: 0.15 },
  line: { ...udrStyles.lineSelected, lineOpacity: 0.8 },
}
