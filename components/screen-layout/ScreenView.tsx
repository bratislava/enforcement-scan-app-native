import { useNavigation } from 'expo-router'
import { ScreenProps } from 'expo-router/build/views/Screen'
import { ReactNode, useEffect } from 'react'
import { View, ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from '@/utils/cn'

import StackScreenWithHeader from './StackScreenWithHeader'

export type ScreenViewProps = {
  children: ReactNode
  title?: string
  contentPosition?: 'default' | 'center'
  actionButton?: ReactNode
  /**
   * Whether to show the back button in the header
   * @default true
   */
  hasBackButton?: boolean
  options?: Exclude<ScreenProps['options'], Function>
} & ViewProps

const ScreenView = ({
  children,
  className,
  title,
  contentPosition = 'default',
  actionButton,
  hasBackButton = true,
  options,
  ...rest
}: ScreenViewProps) => {
  const navigation = useNavigation()
  useEffect(() => {
    // This is our problem: https://github.com/expo/expo/issues/24553#issuecomment-1749261475
    // but the solution provided does not work
    // Here we are hiding the header for the root navigation when the nested navigator is rendered
    // this keeps the back button working as expected and the title is also correctly displayed
    const rootNavigation = navigation.getParent()
    rootNavigation?.setOptions({ headerShown: false })
  }, [navigation])

  const insets = useSafeAreaInsets()

  const hasHeader = title || options || hasBackButton

  return (
    <View className="flex-1 bg-white">
      <View
        className={cn('flex-1', className)}
        style={{
          paddingTop:
            !options?.headerTransparent && options?.headerShown !== false && hasHeader
              ? undefined
              : insets.top,
          paddingBottom: insets.bottom,
        }}
        {...rest}
      >
        {hasHeader ? (
          <StackScreenWithHeader
            options={{
              title,
              headerBackVisible: hasBackButton,
              ...options,
            }}
          />
        ) : null}

        <View
          className={cn('flex-1', {
            'justify-center': contentPosition === 'center',
          })}
        >
          {children}
        </View>

        {actionButton ? (
          <View className="p-5" style={{ paddingBottom: 12 }}>
            {actionButton}
          </View>
        ) : null}
      </View>
    </View>
  )
}

export default ScreenView
