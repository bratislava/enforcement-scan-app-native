import { environment } from '@/environment'

/**
 * Api returns image with url that is not complete, this function creates a complete url from the image object
 */
export const addImageCdnUrl = (photoUrl: string): string => `${environment.imageCdn}${photoUrl}`
