import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { forwardRef, ReactNode, useCallback, useRef } from 'react'
import {
  Pressable,
  TextInput as TextInputNative,
  TextInputProps as TextInputNativeProps,
  View,
} from 'react-native'
import { TextInput as TextInputType } from 'react-native-gesture-handler'

import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { cn } from '@/utils/cn'

export type TextInputProps = Omit<TextInputNativeProps, 'editable'> & {
  hasError?: boolean
  isDisabled?: boolean
  leftIcon?: ReactNode
  isInsideBottomSheet?: boolean
}

// TODO associate control with label
// eslint-disable-next-line no-secrets/no-secrets
// TODO multiline height on ios, inspiration?: https://stackoverflow.com/questions/35936908/numberoflines-textinput-property-not-working

const TextInput = forwardRef<TextInputType, TextInputProps>(
  (
    {
      hasError,
      isDisabled,
      leftIcon,
      multiline,
      className,
      pointerEvents,
      isInsideBottomSheet,
      ...rest
    },
    ref,
  ) => {
    const localRef = useRef<TextInputType>(null)
    const refSetter = useMultipleRefsSetter<TextInputType>(localRef, ref)

    const handlePress = useCallback(() => {
      localRef.current?.focus()
    }, [])

    const InputElement = isInsideBottomSheet ? BottomSheetTextInput : TextInputNative

    return (
      <Pressable
        onPress={handlePress}
        pointerEvents={pointerEvents}
        className={cn('flex-row items-center rounded border bg-white px-4 py-3 g-3', {
          'border-divider focus:border-dark': !isDisabled && !hasError,
          'border-negative': hasError && !isDisabled,
          'border-divider bg-[#D6D6D6]': isDisabled,
          'flex-1': multiline,
        })}
      >
        {leftIcon ? <View aria-hidden>{leftIcon}</View> : null}
        {/* TODO lineHeight does not work properly on ios, see issue: https://github.com/facebook/react-native/issues/39145 */}
        {/* Quick-fix by setting height instead of lineHeight */}
        {/* Instead of "h-[24px] text-[16px]", it should use only predefined "text-16" */}
        <InputElement
          ref={refSetter}
          editable={!isDisabled}
          className={cn(
            'flex-1 font-inter-400regular text-[16px]',
            !multiline && 'h-[24px]',
            className,
          )}
          multiline={multiline}
          {...rest}
        />
      </Pressable>
    )
  },
)

export default TextInput
