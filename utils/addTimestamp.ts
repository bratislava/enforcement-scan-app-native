import Marker, { ImageFormat, Position, TextBackgroundType } from 'react-native-image-marker'

import { getPhotoUri } from '@/modules/camera/utils/getPhotoUri'

export const addTimestamp = async (imagePath?: string) => {
  const imageUri = getPhotoUri(imagePath)

  if (!imageUri) return ''

  const timestamp = new Date().toLocaleString()

  try {
    const newUri = await Marker.markText({
      backgroundImage: {
        src: imageUri,
      },
      watermarkTexts: [
        {
          text: timestamp,
          positionOptions: {
            position: Position.bottomRight,
          },
          style: {
            color: '#fff',
            fontSize: 12,
            fontName: 'Arial',
            textBackgroundStyle: {
              paddingX: 2,
              paddingY: 2,
              type: TextBackgroundType.none,
              color: '#000',
            },
          },
        },
      ],
      quality: 100,
      saveFormat: ImageFormat.png,
    })

    return getPhotoUri(newUri)
  } catch (error) {
    console.error('Error adding timestamp:', error)
  }

  return imageUri
}
