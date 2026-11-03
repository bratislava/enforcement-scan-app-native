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
    circleRadius: ['interpolate', ['linear'], ['zoom'], 15, 3, 20, 7],
    circleStrokeColor: colors.white,
    circleStrokeWidth: 1.5,
  },
  // bigger pins for the sign select screen, so they are easy to tap
  circleSelectable: {
    circleColor: ['match', ['get', 'typ_znacky'], 'rezidenti', colors.lightBlue, colors.green],
    circleRadius: ['interpolate', ['linear'], ['zoom'], 12, 5, 18, 10],
    circleStrokeColor: colors.white,
    circleStrokeWidth: 2,
  },
  circleSelected: {
    circleColor: ['match', ['get', 'typ_znacky'], 'rezidenti', colors.lightBlue, colors.green],
    circleRadius: ['interpolate', ['linear'], ['zoom'], 12, 9, 18, 15],
    circleStrokeColor: colors.orange,
    circleStrokeWidth: 4,
  },
}
