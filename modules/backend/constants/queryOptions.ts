import { queryOptions } from '@tanstack/react-query'

import { clientApi } from '@/modules/backend/client-api'

export const getFavouritePhotosOptions = () =>
  queryOptions({
    queryKey: ['FavouritePhotos'],
    queryFn: () => clientApi.scanControllerGetFavouritePhotos(),
    select: (res) => res.data,
  })

export const getVehiclePropertiesOptions = (ecv?: string) =>
  queryOptions({
    queryKey: ['VehicleProperties', ecv],
    queryFn: () => clientApi.scanControllerGetVehicleProperties(ecv!),
    select: (res) => res.data,
    enabled: !!ecv,
  })

export const mobileAppVersionOptions = () =>
  queryOptions({
    queryKey: ['MobileVersion'],
    queryFn: () => clientApi.systemControllerGetMobileAppVersion(),
    select: (res) => res.data,
  })
