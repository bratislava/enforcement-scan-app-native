import { View } from 'react-native'

import ZoneBadge from '@/components/info/ZoneBadge'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useOffenceTypeLabel } from '@/hooks/useOffenceTypeLabel'
import { ResponseGetOffenceOverviewDto } from '@/modules/backend/openapi-generated'
import { formatDateTime } from '@/utils/formatDateTime'

// isAutoCancelled should not be shown here but is in dto and comes as props in case it will be needed in the future
type Props = Omit<ResponseGetOffenceOverviewDto, 'isAutoCancelled'>

const OffenceTile = ({ ecv, udr, offenceType, createdAt }: Props) => {
  const getOffenceTypeLabel = useOffenceTypeLabel()

  return (
    <Panel>
      <View className="flex-row justify-between">
        <Typography variant="h2">{ecv}</Typography>
        {udr ? <ZoneBadge label={udr} /> : null}
      </View>
      <Typography variant="h3">{getOffenceTypeLabel(offenceType)}</Typography>
      <Typography>{formatDateTime(new Date(createdAt))}</Typography>
    </Panel>
  )
}

export default OffenceTile
