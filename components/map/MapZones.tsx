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
  const udrDataByStatus = useMemo(
    () => ({
      active: {
        ...udrData,
        features: udrData.features.filter(
          (udr) => udr.properties?.status === MapZoneStatusEnum.active,
        ),
      },
      residents: {
        ...udrData,
        features: udrData.features.filter((udr) => udr.properties?.udrId === '0'),
      },
    }),
    [udrData],
  )

  return (
    <>
      {udrDataByStatus.residents.features?.length > 0 && (
        <ShapeSource id="udrSourceResidents" shape={udrDataByStatus.residents}>
          <FillLayer
            // The id is used in camera change handler to fill selected polygon
            id="udrFillResidents"
            style={udrStyles.zoneFillResidents}
          />
          <LineLayer id="udrLineResidents" style={udrStyles.lineResidents} />
        </ShapeSource>
      )}
      {udrDataByStatus.active.features?.length > 0 && (
        <ShapeSource id="udrSourceActive" shape={udrDataByStatus.active}>
          <FillLayer
            // The id is used in camera change handler to fill selected polygon
            id="udrFillActive"
            style={udrStyles.zoneFillActive}
          />
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
