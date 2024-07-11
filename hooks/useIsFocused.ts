import { useNavigation } from 'expo-router'
import { useCallback, useSyncExternalStore } from 'react'

/**
 * Hook to get the current focus state of the app. Returns a `true` if app is focused, otherwise `false`.
 */
export function useIsFocused(): boolean {
  const navigation = useNavigation()

  const subscribe = useCallback(
    (callback: () => void) => {
      const unsubscribeFocus = navigation.addListener('focus', callback)
      const unsubscribeBlur = navigation.addListener('blur', callback)

      return () => {
        unsubscribeFocus()
        unsubscribeBlur()
      }
    },
    [navigation],
  )

  return useSyncExternalStore(subscribe, navigation.isFocused, navigation.isFocused)
}
