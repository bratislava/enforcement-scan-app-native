import Marker, { ImageFormat, Position, TextBackgroundType } from 'react-native-image-marker'

import { getPhotoUri } from '@/modules/camera/utils/getPhotoUri'

/**
 * Add provided text to the image
 * @param imagePath path to image in the device
 * @param text
 * @returns path to the new image with the given text in it
 */
export const addTextToImage = async (
  text: string,
  imagePath?: string,
  position: Position | undefined = Position.bottomRight,
) => {
  const imageUri = getPhotoUri(imagePath)

  if (!imageUri) return ''

  try {
    const newUri = await Marker.markText({
      backgroundImage: {
        src: imageUri,
      },
      watermarkTexts: [
        {
          text,
          positionOptions: {
            position,
          },
          style: {
            color: '#fff',
            fontSize: 16,
            fontName: 'Arial',
            textBackgroundStyle: {
              paddingX: 4,
              paddingY: 4,
              type: TextBackgroundType.none,
              color: '#000',
            },
          },
        },
      ],
      quality: 20,
      saveFormat: ImageFormat.jpg,
    })

    return getPhotoUri(newUri)
  } catch (error) {
    console.error('Error adding text:', error)
  }

  return imageUri
}
