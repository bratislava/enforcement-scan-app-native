import { queryOptions } from '@tanstack/react-query'

import { clientApi } from '@/modules/backend/client-api'

export const getFavoritePhotosOptions = () =>
  queryOptions({
    queryKey: ['FavoritePhotos'],
    queryFn: () => clientApi.scanControllerGetFavouritePhotos(),
    select: (res) => res.data,
  })
