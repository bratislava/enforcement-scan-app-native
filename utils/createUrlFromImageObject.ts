import { environment } from '@/environment'
import { ZonePhoto } from '@/state/OffenceStore/OffenceStoreProvider'

/**
 * Api returns image with url that is not complete, this function creates a complete url from the image object
 */
export const createUrlFromImageObject = (image: ZonePhoto): string =>
  `${image.id ? environment.imageCdn : ''}${image.photoUrl}`
