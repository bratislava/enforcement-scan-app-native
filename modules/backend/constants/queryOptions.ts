import { queryOptions, skipToken } from '@tanstack/react-query'

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
    queryFn: ecv ? () => clientApi.scanControllerGetVehicleProperties(ecv) : skipToken,
    select: (res) => res.data,
  })

export const getMobileAppVersionOptions = () =>
  queryOptions({
    queryKey: ['MobileVersion'],
    queryFn: () => clientApi.systemControllerGetMobileAppVersion(),
    select: (res) => res.data,
  })

export const getOffencesOverview = () =>
  queryOptions({
    queryKey: ['offencesOverview'],
    queryFn: () => clientApi.scanControllerOffenceOverview(),
    select: (res) => res.data.offences,
  })

export const getLicencePlateTicketsAndPermitsInfo = (ecv?: string) =>
  queryOptions({
    queryKey: ['licencePlateTicketsPermitsInfo', ecv],
    queryFn: ecv ? () => clientApi.scanControllerTicketsAndPermits(ecv) : skipToken,
    select: (res) => res.data,
  })
