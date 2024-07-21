import Marker, { ImageFormat, Position, TextBackgroundType } from 'react-native-image-marker'
import { Orientation } from 'react-native-vision-camera'

import { getPhotoUri } from '@/modules/camera/utils/getPhotoUri'

type AddTextToImageOptions = {
  text: string
  imagePath?: string
  position?: Position
  orientation?: Orientation
}

/**
 * Add provided text to the image
 * @param imagePath path to image in the device
 * @param text
 * @returns path to the new image with the given text in it
 */
export const addTextToImage = async ({
  position,
  orientation,
  imagePath,
  text,
}: AddTextToImageOptions) => {
  const imageUri = getPhotoUri(imagePath)

  if (!imageUri) return ''

  const rotate = orientation === 'landscape-left' ? 90 : orientation === 'landscape-right' ? -90 : 0

  try {
    const newUri = await Marker.markText({
      backgroundImage: {
        src: imageUri,
        rotate,
      },
      watermarkTexts: [
        {
          text,
          positionOptions: {
            position: position ?? Position.bottomRight,
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
