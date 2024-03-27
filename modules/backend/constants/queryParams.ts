import { clientApi } from '@/modules/backend/client-api'
import { queryOptions } from '@tanstack/react-query'

export const getFavoritePhotosOptions = () =>
  queryOptions({
    queryKey: ['FavoritePhotos'],
    queryFn: () => clientApi.scanControllerGetFavouritePhotos(),
    select: (res) => res.data,
  })
