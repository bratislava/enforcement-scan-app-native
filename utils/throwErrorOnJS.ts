/**
 * Code here is copied from react-native-vision-camera's throwErrorOnJS.ts because of customized runAsync.ts file. May be fixed in future, for now this is the workaround.
 * the issue: https://github.com/mrousavy/react-native-vision-camera/issues/2820
 */

import { CameraRuntimeError } from 'react-native-vision-camera'
import { Worklets } from 'react-native-worklets-core'

export class FrameProcessorsUnavailableError extends CameraRuntimeError {
  constructor(reason: unknown) {
    super(
      'system/frame-processors-unavailable',
      'Frame Processors are not available, react-native-worklets-core is not installed! ' +
        `Error: ${reason instanceof Error ? reason.message : reason}`,
    )
  }
}

/**
 * Rethrows the given message and stack as a JS Error on the JS Thread.
 */
let rethrowErrorOnJS: (message: string, stack: string | undefined) => Promise<void>

try {
  rethrowErrorOnJS = Worklets.createRunOnJS((message: string, stack: string | undefined) => {
    const error = new Error(message)

    error.stack = stack
    error.name = 'Frame Processor Error'
    // @ts-expect-error this is react-native specific
    error.jsEngine = 'VisionCamera'

    // just log it to console.error as a fallback
    console.error('Frame Processor Error:', error)
  })
} catch (error) {
  // react-native-worklets-core is not installed!
  // Just use dummy implementations that will throw when the user tries to use Frame Processors.
  rethrowErrorOnJS = () => {
    throw new FrameProcessorsUnavailableError(error)
  }
}

/**
 * Throws the given Error on the JS Thread using React Native's error reporter.
 * @param error An {@linkcode Error}, or an object with a `message` property, otherwise a default messageg will be thrown.
 */
export function throwErrorOnJS(error: unknown): void {
  'worklet'

  const safeError = error as Error | undefined
  const message =
    safeError != null && 'message' in safeError
      ? safeError.message
      : 'Frame Processor threw an error.'
  rethrowErrorOnJS(message, safeError?.stack)
}
