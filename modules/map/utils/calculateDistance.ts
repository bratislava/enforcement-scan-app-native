const R = 6371 // earth's radius in km
const toRad = (value: number) => (value * Math.PI) / 180

/**
 * Function to calculate distance between two coordinates using the Haversine formula
 */
export const calculateDistance = (values: [number, number, number, number]) => {
  const [lat1, lon1, lat2, lon2] = values.map((v) => toRad(v))

  const dlat = lat2 - lat1
  const dlon = lon2 - lon1

  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2
  const c = Math.asin(Math.sqrt(a))

  return 2 * R * c
}
