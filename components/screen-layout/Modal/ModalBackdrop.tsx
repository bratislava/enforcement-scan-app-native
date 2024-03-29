import { View, ViewProps } from 'react-native'

import { cn } from '@/utils/cn'

const ModalBackdrop = ({ className, ...rest }: ViewProps) => {
  return (
    <View
      {...rest}
      className={cn('flex-1 items-center justify-center bg-dark/50 p-5', className)}
    />
  )
}

export default ModalBackdrop
