import { View } from 'react-native'

import FlexRow from '@/components/shared/FlexRow'
import Icon, { IconName } from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'

type Props = {
  title: string
  // description: string
  icon: IconName
  onPress: () => void
}

const RoleTile = ({ title, icon, onPress }: Props) => (
  <PressableStyled onPress={onPress}>
    <Panel>
      <FlexRow className="items-center g-4">
        <Icon name={icon} />

        <View className="flex-1">
          <Typography variant="default-semibold">{title}</Typography>
          {/* Hide description for now */}
          {/* <Typography>{description}</Typography> */}
        </View>

        <Icon name="chevron-right" />
      </FlexRow>
    </Panel>
  </PressableStyled>
)

export default RoleTile
