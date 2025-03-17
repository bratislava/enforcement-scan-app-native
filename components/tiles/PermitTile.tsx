import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { ResponseCardDto } from '@/modules/backend/openapi-generated'
import { cn } from '@/utils/cn'

const PermitTile = ({ cardSchemeName, cardSubject, state }: ResponseCardDto) => {
  const { t } = useTranslation()

  return (
    <Panel className={cn(state === 'VALID' ? 'bg-green/25' : 'bg-negative/25')}>
      <Typography variant="h2">{cardSchemeName}</Typography>

      <View className="flex-row justify-between">
        <Typography>{cardSubject}</Typography>

        <Typography variant="h2">{t(`scanLicencePlate.info.state.${state}`)}</Typography>
      </View>
    </Panel>
  )
}

export default PermitTile
