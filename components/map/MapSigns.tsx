import { CircleLayer, ShapeSource } from '@rnmapbox/maps'
import { Feature, Point, Position } from 'geojson'

import { calculateDistance } from '@/modules/map/utils/calculateDistance'
import { signStyles } from '@/modules/map/utils/layer-styles/visitors'
import { useArcgisStoreContext } from '@/state/ArcgisStore/useArcgisStoreContext'

// Pins are hidden when zoomed out to avoid clutter
const SIGNS_MIN_ZOOM = 15

// Pins closer than this are treated as one place (e.g. two signs on one pole), zooming in would not separate them
const SAME_PLACE_DISTANCE_M = 3

// only zone and resident signs are relevant, other types (e.g. 'skola') are hidden
const SIGN_TYPE_FILTER = ['in', ['get', 'typ_znacky'], ['literal', ['zona', 'rezidenti']]]

type Props = {
  /** When set, pins are bigger, always visible and can be tapped */
  onSignPress?: (globalId: string) => void
  /** Called instead of onSignPress when one tap covers several pins that are not at the same place */
  onSignsClusterPress?: (coordinates: Position[]) => void
  selectedSignId?: string
}

const getPointFeatures = (features: Feature[]) =>
  features.flatMap((feature) =>
    feature.geometry.type === 'Point' ? [feature as Feature<Point>] : [],
  )

const getMaxSpreadInMeters = (features: Feature<Point>[]) => {
  let maxDistance = 0
  features.forEach((a, index) => {
    features.slice(index + 1).forEach((b) => {
      const [lonA, latA] = a.geometry.coordinates
      const [lonB, latB] = b.geometry.coordinates
      maxDistance = Math.max(maxDistance, calculateDistance([latA, lonA, latB, lonB]) * 1000)
    })
  })

  return maxDistance
}

/**
 * Renders zone sign points from ArcGIS as pins on the map
 */
const MapSigns = ({ onSignPress, onSignsClusterPress, selectedSignId }: Props) => {
  const { signData } = useArcgisStoreContext()

  if (!signData?.features?.length) return null

  const isSelectable = !!onSignPress

  const handlePress = (features: Feature[], tap: { latitude: number; longitude: number }) => {
    const pointFeatures = getPointFeatures(features)

    // the touch area covers several pins: zoom in so the inspector can tap the right one
    if (
      onSignsClusterPress &&
      pointFeatures.length > 1 &&
      getMaxSpreadInMeters(pointFeatures) > SAME_PLACE_DISTANCE_M
    ) {
      onSignsClusterPress(pointFeatures.map((feature) => feature.geometry.coordinates))

      return
    }

    // otherwise pick the pin closest to the tap
    const nearest = pointFeatures
      .map((feature) => {
        const [lon, lat] = feature.geometry.coordinates

        return { feature, distance: calculateDistance([lat, lon, tap.latitude, tap.longitude]) }
      })
      .sort((a, b) => a.distance - b.distance)[0]?.feature

    const globalId: unknown = nearest?.properties?.GlobalID
    if (typeof globalId === 'string') onSignPress?.(globalId)
  }

  return (
    <ShapeSource
      id="signSource"
      shape={signData}
      onPress={isSelectable ? (event) => handlePress(event.features, event.coordinates) : undefined}
    >
      {/* The ring is drawn below the pins, so it never covers a neighbouring sign.
          ShapeSource does not accept null children, without a selected sign this layer matches nothing. */}
      <CircleLayer
        id="signCircleSelected"
        filter={['==', ['get', 'GlobalID'], selectedSignId ?? '']}
        style={signStyles.circleSelected}
      />

      <CircleLayer
        id="signCircles"
        aboveLayerID="signCircleSelected"
        minZoomLevel={isSelectable ? undefined : SIGNS_MIN_ZOOM}
        filter={SIGN_TYPE_FILTER}
        style={isSelectable ? signStyles.circleSelectable : signStyles.circle}
      />
    </ShapeSource>
  )
}

export default MapSigns
