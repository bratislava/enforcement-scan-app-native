import MapZones from '@/components/map/MapZones'
import { useArcgisStoreContext } from '@/state/ArcgisStore/useArcgisStoreContext'

const LocationMapZones = () => {
  const { udrData } = useArcgisStoreContext()

  return udrData ? <MapZones udrData={udrData} /> : null
}

export default LocationMapZones
