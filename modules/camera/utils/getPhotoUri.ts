import { PhotoFile } from 'react-native-vision-camera'

export const getPhotoUri = (photo?: PhotoFile) => (photo ? `file://${photo.path}` : undefined)
