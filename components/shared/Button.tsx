import { forwardRef } from 'react'
import { Pressable, PressableProps, View } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'
import { cn } from '@/utils/cn'

type PressablePropsOmitted = Omit<PressableProps, 'children'>

export type ButtonProps = {
  children: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'negative' | 'plain' | 'plain-dark'
  startIcon?: IconName
  endIcon?: IconName
  loading?: boolean
  loadingText?: string
  loadingTextEllipsis?: boolean
} & PressablePropsOmitted

export const buttonClassNames = (
  variant: ButtonProps['variant'],
  pressableProps: PressablePropsOmitted,
) => {
  const { disabled } = pressableProps

  const isPlainStyle = variant === 'plain' || variant === 'plain-dark'

  const buttonContainerClassNames = cn(
    'flex flex-row items-center justify-center g-3 active:opacity-70',
    {
      'rounded border p-2.5': !isPlainStyle,
      'border-green bg-green': variant === 'primary',
      'border-green': variant === 'secondary',
      'border-divider': variant === 'tertiary',
      'border-negative bg-negative': variant === 'negative',
      'opacity-50': disabled,
    },
  )

  const buttonTextClassNames = cn('', {
    'text-white': variant === 'primary' || variant === 'negative',
    'text-dark': variant === 'secondary' || variant === 'tertiary' || variant === 'plain-dark',
    'text-green': variant === 'plain',
  })

  return {
    buttonContainerClassNames,
    buttonTextClassNames,
  }
}

const Button = forwardRef<View, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      startIcon,
      endIcon,
      loading,
      loadingText,
      loadingTextEllipsis = true,
      disabled,
      ...restProps
    },
    ref,
  ) => {
    const rest = { ...restProps, disabled: loading || disabled }
    const { buttonContainerClassNames, buttonTextClassNames } = buttonClassNames(variant, rest)

    return (
      <Pressable ref={ref} hitSlop={4} {...rest} className={cn(buttonContainerClassNames)}>
        {loading ? (
          <>
            <Icon name="hourglass-top" className={buttonTextClassNames} />
            <Typography variant="button" className={buttonTextClassNames}>
              {`${loadingText || 'Načítava sa'}${loadingTextEllipsis ? '…' : ''}`}
            </Typography>
          </>
        ) : (
          <>
            {startIcon ? <Icon name={startIcon} className={buttonTextClassNames} /> : null}
            <Typography variant="button" className={buttonTextClassNames}>
              {children}
            </Typography>
            {endIcon ? <Icon name={endIcon} className={buttonTextClassNames} /> : null}
          </>
        )}
      </Pressable>
    )
  },
)

export default Button
