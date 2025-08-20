/* eslint-disable unicorn/no-array-reduce */
import { FillLayer, LineLayer, ShapeSource } from '@rnmapbox/maps'
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import { useMemo } from 'react'

import { MapZoneStatusEnum } from '@/modules/map/constants'
import { MapUdrZoneWithTranslationProps } from '@/modules/map/types'
import { udrStyles } from '@/modules/map/utils/layer-styles/visitors'
import { useArcgisStoreContext } from '@/state/ArcgisStore/useArcgisStoreContext'

type Props = {
  udrData: FeatureCollection<Polygon | MultiPolygon, MapUdrZoneWithTranslationProps>
}

const MapZoneShapes = ({ udrData }: Props) => {
  const shownUdrData = useMemo(
    () => ({
      ...udrData,
      features: udrData.features.filter(
        (udr) => udr.properties?.status !== MapZoneStatusEnum.planned,
      ),
    }),
    [udrData],
  )

  const udrDataByStatus = useMemo(
    () => ({
      active: {
        ...shownUdrData,
        features: shownUdrData.features.filter(
          (udr) => udr.properties?.status === MapZoneStatusEnum.active,
        ),
      },
      residents: {
        ...shownUdrData,
        features: shownUdrData.features.filter((udr) => udr.properties?.udrId === '0'),
      },
    }),
    [shownUdrData],
  )

  return (
    <>
      {shownUdrData.features.length > 0 && (
        <ShapeSource id="udrSource" shape={shownUdrData}>
          <FillLayer id="udrFill" style={udrStyles.zoneFill} />
        </ShapeSource>
      )}
      {udrDataByStatus.residents.features?.length > 0 && (
        <ShapeSource id="udrSourceResidents" shape={udrDataByStatus.residents}>
          <FillLayer id="udrFillResidents" style={udrStyles.zoneFillResidents} />
          <LineLayer id="udrLineResidents" style={udrStyles.lineResidents} />
        </ShapeSource>
      )}
      {udrDataByStatus.active.features?.length > 0 && (
        <ShapeSource id="udrSourceActive" shape={udrDataByStatus.active}>
          <LineLayer id="udrLineActive" style={udrStyles.lineActive} />
        </ShapeSource>
      )}
    </>
  )
}

const MapZones = () => {
  const { udrData } = useArcgisStoreContext()

  return udrData ? <MapZoneShapes udrData={udrData} /> : null
}

export default MapZones
