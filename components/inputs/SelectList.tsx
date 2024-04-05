import { FlatList } from 'react-native'

import ActionRow from '@/components/list-rows/ActionRow'
import Divider from '@/components/shared/Divider'
import Icon from '@/components/shared/Icon'
import PressableStyled from '@/components/shared/PressableStyled'

type Props<T extends string> = {
  options: { label: string; value: T }[]
  value?: T
  onSelect: (value: T) => void
}

const SelectList = <T extends string>({ options, value, onSelect }: Props<T>) => {
  return (
    <FlatList
      ItemSeparatorComponent={() => <Divider />}
      data={options}
      renderItem={({ item }) => (
        <PressableStyled key={item.value} onPress={() => onSelect(item.value)}>
          <ActionRow
            endSlot={value === item.value ? <Icon name="check-circle" /> : null}
            label={item.label}
          />
        </PressableStyled>
      )}
    />
  )
}

export default SelectList
