import { BottomSheetView } from '@gorhom/bottom-sheet'
import { ComponentProps } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { clsx } from '@/utils/clsx'

type Props = Omit<ComponentProps<typeof BottomSheetView>, 'className'> & {
  cn?: string
}

const BottomSheetContent = ({ children, cn }: Props) => {
  const insets = useSafeAreaInsets()

  return (
    <BottomSheetView className={clsx('px-5 py-3', cn)}>
      {children}

      <View style={{ height: insets.bottom }} aria-hidden />
    </BottomSheetView>
  )
}

export default BottomSheetContent
