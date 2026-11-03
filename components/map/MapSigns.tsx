import { CircleLayer, ShapeSource } from '@rnmapbox/maps'

import { signStyles } from '@/modules/map/utils/layer-styles/visitors'
import { useArcgisStoreContext } from '@/state/ArcgisStore/useArcgisStoreContext'

// Pins are hidden when zoomed out to avoid clutter
const SIGNS_MIN_ZOOM = 15

// only zone and resident signs are relevant, other types (e.g. 'skola') are hidden
const SIGN_TYPE_FILTER = ['in', ['get', 'typ_znacky'], ['literal', ['zona', 'rezidenti']]]

type Props = {
  /** When set, pins are bigger, always visible and can be tapped */
  onSignPress?: (globalId: string) => void
  selectedSignId?: string
}

/**
 * Renders zone sign points from ArcGIS as pins on the map
 */
const MapSigns = ({ onSignPress, selectedSignId }: Props) => {
  const { signData } = useArcgisStoreContext()

  if (!signData?.features?.length) return null

  const isSelectable = !!onSignPress

  return (
    <ShapeSource
      id="signSource"
      shape={signData}
      onPress={
        onSignPress
          ? (event) => {
              const globalId: unknown = event.features[0]?.properties?.GlobalID
              if (typeof globalId === 'string') onSignPress(globalId)
            }
          : undefined
      }
    >
      <CircleLayer
        id="signCircles"
        minZoomLevel={isSelectable ? undefined : SIGNS_MIN_ZOOM}
        filter={SIGN_TYPE_FILTER}
        style={isSelectable ? signStyles.circleSelectable : signStyles.circle}
      />

      {/* ShapeSource does not accept null children, without a selected sign this layer matches nothing */}
      <CircleLayer
        id="signCircleSelected"
        aboveLayerID="signCircles"
        filter={['==', ['get', 'GlobalID'], selectedSignId ?? '']}
        style={signStyles.circleSelected}
      />
    </ShapeSource>
  )
}

export default MapSigns
