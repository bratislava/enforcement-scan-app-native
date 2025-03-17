import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { ResponseTicketDto } from '@/modules/backend/openapi-generated'
import { cn } from '@/utils/cn'

const TicketTile = ({ udr, isValid }: ResponseTicketDto) => {
  const { t } = useTranslation()

  return (
    <Panel className={cn(isValid ? 'bg-green/25' : 'bg-negative/25')}>
      <View className="flex-row justify-between">
        <Typography variant="h2">{udr}</Typography>

        <Typography variant="h2">
          {t(`scanLicencePlate.info.state.${isValid ? 'VALID' : 'INVALID'}`)}
        </Typography>
      </View>
    </Panel>
  )
}

export default TicketTile
