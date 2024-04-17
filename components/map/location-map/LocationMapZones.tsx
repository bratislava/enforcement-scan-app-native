import MapZones from '@/components/map/MapZones'
import { useArcgisStoreContext } from '@/state/ArcgisStore/useArcgisStoreContext'

const LocationMapZones = () => {
  const { isLoading, ...processedData } = useArcgisStoreContext()

  return processedData?.udrData ? <MapZones udrData={processedData.udrData} /> : null
}

export default LocationMapZones
