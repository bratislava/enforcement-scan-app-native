import { ActivityIndicator, View, ViewProps } from 'react-native'

import ScreenView, { ScreenViewProps } from '@/components/screen-layout/ScreenView'
import { cn } from '@/utils/cn'

type LoadingScreenProps =
  | ({
      asScreenView: true
    } & Omit<ScreenViewProps, 'children'>)
  | ({ asScreenView?: false } & ViewProps)

const LoadingScreen = ({ asScreenView, className, ...rest }: LoadingScreenProps) => {
  if (asScreenView) {
    return (
      <ScreenView
        className={cn('flex-1 items-center justify-center', className)}
        contentPosition="center"
        {...rest}
      >
        <ActivityIndicator size="large" />
      </ScreenView>
    )
  }

  return (
    <View className={cn('flex-1 items-center justify-center', className)} {...rest}>
      <ActivityIndicator size="large" />
    </View>
  )
}

export default LoadingScreen
