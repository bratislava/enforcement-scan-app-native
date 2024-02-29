import { Text as TextNative, TextProps } from 'react-native'

import { clsx } from '@/utils/clsx'

export type TypographyProps = TextProps & {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'default'
    | 'default-semibold'
    | 'default-bold'
    | 'small'
    | 'small-semibold'
    | 'small-bold'
    | 'button'
}

const Typography = ({ variant = 'default', children, className, ...rest }: TypographyProps) => {
  return (
    <TextNative
      className={clsx(
        'font-inter-400regular text-dark',
        {
          'text-base font-inter-700bold': variant === 'button',
          'font-belfast-700bold text-h1': variant === 'h1',
          'font-belfast-700bold text-h2': variant === 'h2',
          'font-belfast-700bold text-h3': variant === 'h3',
          'text-base': variant.startsWith('default'),
          'text-sm': variant.startsWith('small'),
          'font-inter-600semibold': variant.includes('-semibold'),
          'font-inter-700bold': variant.includes('-bold'),
        },
        className,
      )}
      {...rest}
    >
      {children}
    </TextNative>
  )
}

export default Typography
