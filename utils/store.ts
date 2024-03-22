export type Store<T> = {
  getState: () => T
  setState: (action: T | ((prev: T) => T)) => void
  subscribe: (callback: () => void) => () => void
}

/**
 * Creates a store object that holds a state and allows to update it and subscribe to changes
 * @param initialState The initial state of the store
 * @returns A store object with the following methods:
 * - getState: Returns the current state
 * - setState: Updates the state with a new value or a function that receives the previous state and returns the new state
 * - subscribe: Registers a callback that will be called whenever the state changes. Returns a function to unsubscribe the callback
 */
export const createStore = <T>(initialState: T): Store<T> => {
  let state = initialState
  const callbacks = new Set<() => void>()
  const getState = () => state
  const setState = (nextState: T | ((prev: T) => T)) => {
    state = typeof nextState === 'function' ? (nextState as (prev: T) => T)(state) : nextState
    callbacks.forEach((callback) => callback())
  }
  const subscribe = (callback: () => void) => {
    callbacks.add(callback)

    return () => {
      callbacks.delete(callback)
    }
  }

  return { getState, setState, subscribe }
}
