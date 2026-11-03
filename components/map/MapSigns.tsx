import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps'
import { Feature, FeatureCollection, Point, Position } from 'geojson'
import { useMemo, useRef } from 'react'

import signRezidentiImage from '@/assets/map/sign-rezidenti.png'
import signZonaImage from '@/assets/map/sign-zona.png'
import { Arcgis } from '@/modules/arcgis/types'
import { calculateDistance } from '@/modules/map/utils/calculateDistance'
import { signStyles } from '@/modules/map/utils/layer-styles/visitors'
import { useArcgisStoreContext } from '@/state/ArcgisStore/useArcgisStoreContext'

// only zone and resident signs are relevant, other types (e.g. 'skola') are left out
const SIGN_TYPES = new Set<Arcgis.SignPoint['typ_znacky']>(['zona', 'rezidenti'])

// signs closer than this on screen are merged into one bubble with a count
const CLUSTER_RADIUS_PX = 40
// from this zoom on every sign is shown on its own, even when two signs stand on one pole
const CLUSTER_MAX_ZOOM = 18

// names used by `iconImage` in signStyles
const SIGN_IMAGES = { signZona: signZonaImage, signRezidenti: signRezidentiImage }

export type SignFeature = Feature<Point, Arcgis.SignPoint & { label: string }>

type Props = {
  selectedSignId?: string
  onSignPress: (globalId: string) => void
  /** Called with the cluster position and the zoom at which the cluster splits into signs */
  onClusterPress: (center: Position, zoomLevel: number) => void
}

/**
 * Text under the sign icon: the zone code, or the resident area code for resident signs
 */
const getSignLabel = (sign: Arcgis.SignPoint) =>
  ((sign.typ_znacky === 'rezidenti' ? sign.rezidenti : null) ?? sign.zona ?? '').trim()

const toCollection = (features: SignFeature[]): FeatureCollection<Point> => ({
  type: 'FeatureCollection',
  features,
})

/**
 * Renders zone and resident signs as tappable sign icons, close signs are merged into clusters
 */
const MapSigns = ({ selectedSignId, onSignPress, onClusterPress }: Props) => {
  const { signData } = useArcgisStoreContext()
  const clusterSource = useRef<ShapeSource>(null)

  const signs = useMemo(
    () =>
      (signData?.features ?? [])
        .filter((feature) => SIGN_TYPES.has(feature.properties.typ_znacky))
        .map(
          (feature): SignFeature => ({
            ...feature,
            properties: { ...feature.properties, label: getSignLabel(feature.properties) },
          }),
        ),
    [signData],
  )

  // the selected sign is drawn from its own source, so it is never hidden inside a cluster
  const { clustered, selected } = useMemo(
    () => ({
      clustered: toCollection(signs.filter((sign) => sign.properties.GlobalID !== selectedSignId)),
      selected: toCollection(signs.filter((sign) => sign.properties.GlobalID === selectedSignId)),
    }),
    [signs, selectedSignId],
  )

  if (signs.length === 0) return null

  const handlePress = async (features: Feature[], tap: { latitude: number; longitude: number }) => {
    const cluster = features.find((feature) => feature.properties?.cluster)
    if (cluster && cluster.geometry.type === 'Point') {
      const zoomLevel = await clusterSource.current?.getClusterExpansionZoom(cluster)
      if (zoomLevel !== undefined) onClusterPress(cluster.geometry.coordinates, zoomLevel)

      return
    }

    // icons can still touch at high zoom, pick the one closest to the tap
    const nearest = features
      .flatMap((feature) => (feature.geometry.type === 'Point' ? [feature as Feature<Point>] : []))
      .map((feature) => {
        const [lon, lat] = feature.geometry.coordinates

        return { feature, distance: calculateDistance([lat, lon, tap.latitude, tap.longitude]) }
      })
      .sort((a, b) => a.distance - b.distance)[0]?.feature

    const globalId: unknown = nearest?.properties?.GlobalID
    if (typeof globalId === 'string') onSignPress(globalId)
  }

  return (
    <>
      <Images images={SIGN_IMAGES} />

      <ShapeSource
        ref={clusterSource}
        id="signSource"
        shape={clustered}
        cluster
        clusterRadius={CLUSTER_RADIUS_PX}
        clusterMaxZoomLevel={CLUSTER_MAX_ZOOM}
        onPress={(event) => {
          // the promise only moves the camera, a failed lookup leaves the map as it is
          handlePress(event.features, event.coordinates).catch(() => {})
        }}
      >
        <CircleLayer id="signClusters" filter={['has', 'point_count']} style={signStyles.cluster} />
        <SymbolLayer
          id="signClusterCount"
          filter={['has', 'point_count']}
          style={signStyles.clusterCount}
        />
        <SymbolLayer
          id="signIcons"
          filter={['!', ['has', 'point_count']]}
          style={signStyles.icon}
        />
      </ShapeSource>

      <ShapeSource id="signSelectedSource" shape={selected}>
        <CircleLayer id="signSelectedFrame" style={signStyles.selectedFrame} />
        <SymbolLayer
          id="signSelectedIcon"
          aboveLayerID="signSelectedFrame"
          style={signStyles.selectedIcon}
        />
      </ShapeSource>
    </>
  )
}

export default MapSigns
