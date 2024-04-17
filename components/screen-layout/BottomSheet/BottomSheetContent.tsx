import { BottomSheetView } from '@gorhom/bottom-sheet'
import { ComponentProps } from 'react'
import { SafeAreaView } from 'react-native'

import { cn } from '@/utils/cn'

type Props = ComponentProps<typeof BottomSheetView> & {
  isDynamic?: boolean
}

const BottomSheetContent = ({ children, className, isDynamic }: Props) => {
  return (
    <SafeAreaView>
      <BottomSheetView className={cn('px-5 py-3', { 'min-h-[80px]': !isDynamic }, className)}>
        {children}
        {/* TODO this should be handled by SafeAreaProvider */}
        {/* spacer */}
      </BottomSheetView>
    </SafeAreaView>
  )
}

export default BottomSheetContent
