/**
 * Get photo uri with file:// prefix
 * @param path path to image in the device
 * @returns path with file:// prefix
 */
export const getPhotoUri = (path?: string) =>
  !path || path.startsWith('file://') ? path || '' : `file://${path}`
