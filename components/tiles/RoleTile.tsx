import { View } from 'react-native'

import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { OFFENCE_TYPES } from '@/modules/backend/constants/offenceTypes'
import { OffenceTypeEnum } from '@/modules/backend/openapi-generated'

type Props = {
  value: OffenceTypeEnum
  onPress: () => void
}

const OffenceTypeTile = ({ value, onPress }: Props) => {
  const offenceTypeObject = OFFENCE_TYPES.find((offenceType) => value === offenceType.value)

  if (!offenceTypeObject) {
    throw new Error('Offence type not found')
  }

  return (
    <PressableStyled testID={value} onPress={onPress}>
      <Panel>
        <FlexRow className="items-center g-4">
          <View className="flex-1">
            <Typography variant="default-semibold">{offenceTypeObject.label}</Typography>
          </View>

          <Icon name="chevron-right" />
        </FlexRow>
      </Panel>
    </PressableStyled>
  )
}

export default OffenceTypeTile
