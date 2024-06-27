import { useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

/**
 * Hook that returns app state
 *
 * @returns one of 'active', 'background', 'inactive', or 'unknown'
 */
export const useAppState: () => AppStateStatus = () => {
  const [appState, setAppState] = useState(AppState.currentState)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState)
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return appState
}
