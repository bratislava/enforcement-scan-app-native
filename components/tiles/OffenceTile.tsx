import { View } from 'react-native'

import ZoneBadge from '@/components/info/ZoneBadge'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { OFFENCE_TYPES } from '@/modules/backend/constants/offenceTypes'
import { ResponseGetOffenceOverviewDto } from '@/modules/backend/openapi-generated'
import { formatDateTime } from '@/utils/formatDateTime'

// isAutoCancelled should not be shown here but is in dto and comes as props in case it will be needed in the future
type Props = Omit<ResponseGetOffenceOverviewDto, 'isAutoCancelled'>

const OffenceTile = ({ ecv, udr, offenceType, createdAt }: Props) => (
  <Panel>
    <View className="flex-row justify-between">
      <Typography variant="h2">{ecv}</Typography>
      {udr ? <ZoneBadge label={udr} /> : null}
    </View>
    <Typography variant="h3">
      {OFFENCE_TYPES.find(({ value }) => value === offenceType)?.label}
    </Typography>
    <Typography>{formatDateTime(new Date(createdAt))}</Typography>
  </Panel>
)

export default OffenceTile
