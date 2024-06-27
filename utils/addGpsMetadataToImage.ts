import { ExifTags, writeAsync } from '@lodev09/react-native-exify'

import { getPhotoUri } from '@/modules/camera/utils/getPhotoUri'

type Props = { imagePath: string; lat: number; long: number }

/**
 * Add gps metadata to the image
 * @param imagePath path to image in the device
 * @param lat latitude
 * @param long longitude
 * @returns path to the new image with the given gps metadata in it
 */
export const addGpsMetadataToImage = async ({ imagePath, lat, long }: Props): Promise<string> => {
  const imageUri = getPhotoUri(imagePath)

  if (!imageUri) return ''

  try {
    const newTags: ExifTags = {
      GPSLatitude: lat,
      GPSLongitude: long,
    }

    const result = await writeAsync(imageUri, newTags)

    return getPhotoUri(result?.uri)
  } catch {
    throw new Error('Error adding gps')
  }
}
