import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Options = {
  safeArea?: boolean
  scale?: boolean
}

// TODO: make screen height dependent?
export const getBottomMapPadding = () => {
  // Half of the `MapZoneBottomSheet` height when zone is shown
  return 50
}

export const useMapCenter = (options?: Options) => {
  const { safeArea = false, scale = false } = options ?? {}
  const insets = useSafeAreaInsets()
  const dimensions = useWindowDimensions()

  return useMemo(() => {
    const bottomPadding = getBottomMapPadding()
    const windowWidth = safeArea ? dimensions.width - insets.right - insets.left : dimensions.width
    const windowHeight = safeArea
      ? dimensions.height - insets.top - insets.bottom
      : dimensions.height

    return {
      top: ((windowHeight - bottomPadding) * (scale ? dimensions.scale : 1)) / 2,
      left: (windowWidth * (scale ? dimensions.scale : 1)) / 2,
    }
  }, [safeArea, dimensions.width, dimensions.height, dimensions.scale, insets, scale])
}
