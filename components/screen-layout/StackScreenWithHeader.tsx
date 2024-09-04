import { router, Stack } from 'expo-router'
import { useCallback, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Typography from '@/components/shared/Typography'
import { cn } from '@/utils/cn'

import IconButton from '../shared/IconButton'

// The options prop is union type (function and object) so we need to exclude the function variant.
// The reason is that we only use the object variant.
type Options = Exclude<React.ComponentProps<typeof Stack.Screen>['options'], Function>
type Props = { options: Options } & React.ComponentProps<typeof Stack.Screen>

/**
 * Component that wraps Stack.Screen and adds some default options
 */
const StackScreenWithHeader = ({ options, ...passingProps }: Props) => {
  const insets = useSafeAreaInsets()
  const [headerLeftWidth, setHeaderLeftWidth] = useState(0)
  const [headerRightWidth, setHeaderRightWidth] = useState(0)
  const handleHeaderLeftLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderLeftWidth(event.nativeEvent.layout.width)
  }, [])
  const handleHeaderRightLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderRightWidth(event.nativeEvent.layout.width)
  }, [])

  const headerSideWidth = Math.max(headerLeftWidth, headerRightWidth)

  const renderHeader: NonNullable<NonNullable<Options>['header']> = useCallback(
    ({ options: headerOptions, back }) => {
      return (
        <View
          className={cn('w-full flex-row', { 'bg-white': !headerOptions?.headerTransparent })}
          style={{ paddingTop: insets.top }}
        >
          <View className="w-full flex-row items-center px-5 py-3">
            {!!back && headerOptions?.headerBackVisible !== false ? (
              <IconButton
                onPress={router.back}
                accessibilityLabel="Späť"
                name={headerOptions.presentation === 'modal' ? 'close' : 'arrow-back'}
                onLayout={handleHeaderLeftLayout}
              />
            ) : null}
            <View
              className="min-w-0 flex-1 flex-row items-center justify-center px-2"
              style={{
                marginLeft: headerSideWidth - headerLeftWidth,
                marginRight: headerSideWidth - headerRightWidth,
              }}
            >
              <Typography variant="h2" numberOfLines={1} className="max-w-full">
                {headerOptions?.title}
              </Typography>
            </View>
            <View className="flex-0" onLayout={handleHeaderRightLayout}>
              {headerOptions?.headerRight?.({
                tintColor: headerOptions.headerTintColor,
                canGoBack: !!back,
              })}
            </View>
          </View>
        </View>
      )
    },
    [
      insets.top,
      handleHeaderLeftLayout,
      handleHeaderRightLayout,
      headerSideWidth,
      headerLeftWidth,
      headerRightWidth,
    ],
  )

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        animation: options?.presentation === 'modal' ? 'slide_from_bottom' : undefined,
        ...options,
        header: renderHeader,
      }}
      {...passingProps}
    />
  )
}

export default StackScreenWithHeader
