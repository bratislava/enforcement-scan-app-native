import { BottomSheetView, useBottomSheet } from '@gorhom/bottom-sheet'
import { ComponentProps } from 'react'
import { SafeAreaView } from 'react-native'

import { cn } from '@/utils/cn'

const BottomSheetContent = ({ children, className }: ComponentProps<typeof BottomSheetView>) => {
  const { expand } = useBottomSheet()

  return (
    <SafeAreaView>
      {/* Everytime bottom sheet renders a content it should automatically open the bottom sheet, we use it only as static bottom sheet without the need to close */}
      <BottomSheetView onLayout={() => expand()} className={cn('px-5 py-3', className)}>
        {children}
      </BottomSheetView>
    </SafeAreaView>
  )
}

export default BottomSheetContent
