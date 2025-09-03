/**
 * Code here is copied from react-native-vision-camera's runAsync.ts and has changed context from custom to default because of issue with runtime worklet context. May be fixed in future, for now this is the workaround.
 * the issue: https://github.com/mrousavy/react-native-vision-camera/issues/2820
 */

import { Frame, FrameInternal } from 'react-native-vision-camera'
import { Worklets } from 'react-native-worklets-core'

import { FrameProcessorsUnavailableError, throwErrorOnJS } from '@/utils/throwErrorOnJS'

/**
 * A synchronized Shared Value to indicate whether the async context is currently executing
 */
let isAsyncContextBusy: { value: boolean }
/**
 * Runs the given function on the async context, and sets {@linkcode isAsyncContextBusy} to false after it finished executing.
 */
let runOnAsyncContext: (frame: Frame, func: () => void) => Promise<void>

try {
  isAsyncContextBusy = Worklets.createSharedValue(false)

  const asyncContext = Worklets.defaultContext
  runOnAsyncContext = asyncContext.createRunAsync((frame: Frame, func: () => void) => {
    'worklet'

    try {
      // Call long-running function
      func()
    } catch (error) {
      // Re-throw error on JS Thread
      throwErrorOnJS(error)
    } finally {
      // Potentially delete Frame if we were the last ref
      const internal = frame as FrameInternal
      internal.decrementRefCount()

      // free up async context again, new calls can be made
      isAsyncContextBusy.value = false
    }
  })
} catch (error) {
  // react-native-worklets-core is not installed!
  // Just use dummy implementations that will throw when the user tries to use Frame Processors.
  isAsyncContextBusy = { value: false }
  runOnAsyncContext = () => {
    throw new FrameProcessorsUnavailableError(error)
  }
}

/**
 * Runs the given {@linkcode func} asynchronously on a separate thread,
 * allowing the Frame Processor to continue executing without dropping a Frame.
 *
 * Only one {@linkcode runAsync} call will execute at the same time,
 * so {@linkcode runAsync} is **not parallel**, **but asynchronous**.
 *
 * @param frame The current Frame of the Frame Processor.
 * @param func The function to execute.
 * @worklet
 */
export function runAsync(frame: Frame, func: () => void): void {
  'worklet'

  if (isAsyncContextBusy.value) {
    // async context is currently busy, we cannot schedule new work in time.
    // drop this frame/runAsync call.
    return
  }

  // Increment ref count by one
  const internal = frame as FrameInternal
  internal.incrementRefCount()

  isAsyncContextBusy.value = true

  // Call in separate background context
  try {
    runOnAsyncContext(frame, func)
  } catch (error) {
    // in case of error, free up the async context again
    isAsyncContextBusy.value = false
    // re-throw error
    throw error
  }
}
