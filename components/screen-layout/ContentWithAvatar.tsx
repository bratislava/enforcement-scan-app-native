import { ReactNode } from 'react'
import { View, ViewProps } from 'react-native'

import AvatarCircle from '@/components/info/AvatarCircle'
import Typography from '@/components/shared/Typography'
import { cn } from '@/utils/cn'

type ContentWithAvatarProps = {
  title: string
  text?: string
  variant?: 'success' | 'error' | 'warning'
  customAvatarComponent?: ReactNode
  actionButton?: ReactNode
  asMarkdown?: boolean
} & ViewProps

const ContentWithAvatar = ({
  title,
  text,
  className,
  children,
  variant,
  customAvatarComponent,
  actionButton,
  ...rest
}: ContentWithAvatarProps) => {
  return (
    <View {...rest} className={cn('w-full bg-white px-5 py-8 g-6', className)}>
      <View className="items-center">
        {customAvatarComponent ?? <AvatarCircle variant={variant} />}
      </View>
      <View className="g-2">
        <Typography variant="h1" className="text-center">
          {title}
        </Typography>
        {text ? <Typography className="text-center">{text}</Typography> : null}
      </View>
      {children}

      {actionButton}
    </View>
  )
}

export default ContentWithAvatar
