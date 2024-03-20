import { BottomSheetView } from '@gorhom/bottom-sheet'
import { ComponentProps } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from '@/utils/cn'

type Props = ComponentProps<typeof BottomSheetView>

const BottomSheetContent = ({ children, className }: Props) => {
  const insets = useSafeAreaInsets()

  return (
    <BottomSheetView className={cn('px-5 py-3', className)}>
      {children}

      <View style={{ height: insets.bottom }} aria-hidden />
    </BottomSheetView>
  )
}

export default BottomSheetContent
