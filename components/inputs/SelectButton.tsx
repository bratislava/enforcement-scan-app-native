import clsx from 'clsx'
import { forwardRef } from 'react'
import { PressableProps, View } from 'react-native'

import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'

type Props = {
  hasError?: boolean
  isDisabled?: boolean
  value?: string
  placeholder?: string
} & Omit<PressableProps, 'disabled'>

const SelectButton = forwardRef<View, Props>(
  ({ hasError, isDisabled, value, placeholder, ...rest }, ref) => {
    return (
      <PressableStyled ref={ref} disabled={isDisabled} {...rest}>
        <Panel
          className={clsx('border border-divider bg-white py-3', {
            'border-divider bg-[#D6D6D6]': isDisabled,
            'border-negative': hasError && !isDisabled,
          })}
        >
          <FlexRow>
            {value ? (
              <Typography className="flex-1 font-inter-400regular text-base">{value}</Typography>
            ) : placeholder ? (
              <Typography className="flex-1 font-inter-400regular text-base text-placeholder">
                {placeholder}
              </Typography>
            ) : null}
            <Icon name="expand-more" />
          </FlexRow>
        </Panel>
      </PressableStyled>
    )
  },
)

export default SelectButton
