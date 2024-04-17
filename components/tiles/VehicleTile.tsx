import { View } from 'react-native'

import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'

type Props = {
  color?: string
  brand?: string
  vehicleType?: string
  isSelected?: boolean
  onPress: () => void
}

const VehicleTile = ({ color, brand, vehicleType, isSelected, onPress }: Props) => (
  <PressableStyled onPress={onPress}>
    <Panel>
      <FlexRow className="items-center g-4">
        <View className="flex-1">
          <Typography variant="default-semibold">
            {brand} - {vehicleType}
          </Typography>

          <Typography>{color}</Typography>
        </View>

        {isSelected && <Icon name="check-circle" />}
      </FlexRow>
    </Panel>
  </PressableStyled>
)

export default VehicleTile
