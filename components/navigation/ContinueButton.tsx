import { forwardRef } from 'react'
import { View } from 'react-native'

import Button, { ButtonProps } from '@/components/shared/Button'

type ContinueButtonProps = Omit<ButtonProps, 'children'> & {
  children?: string
}

/**
 * Simple button with default text "Continue" to be easier to use useTranslation hook in other components
 */
const ContinueButton = forwardRef<View, ContinueButtonProps>(
  ({ children, variant, ...rest }, ref) => {
    return (
      <Button ref={ref} variant={variant ?? 'primary'} {...rest}>
        {children ?? 'Continue'}
      </Button>
    )
  },
)

export default ContinueButton
