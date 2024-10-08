import { Link } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ZoneBadge from '@/components/info/ZoneBadge'
import ContinueButton from '@/components/navigation/ContinueButton'
import FlexRow from '@/components/shared/FlexRow'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { OffenceTypeEnum } from '@/modules/backend/openapi-generated'
import { MapUdrZoneWithTranslationProps } from '@/modules/map/types'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

type Props = {
  selectedZone: MapUdrZoneWithTranslationProps | null
}

const MapZoneBottomSheetPanel = ({ selectedZone }: Props) => {
  const { t } = useTranslation()

  const { setOffenceState } = useSetOffenceState()

  const onZonePick = () => {
    if (selectedZone) {
      setOffenceState({
        zone: selectedZone,
        zonePhoto: undefined,
        offenceType: selectedZone?.udrId === '0' ? OffenceTypeEnum.NB : OffenceTypeEnum.O,
      })
    }
  }

  if (selectedZone) {
    return (
      <>
        <Panel className="g-4">
          <FlexRow>
            <Typography numberOfLines={1} className="flex-1 text-ellipsis">
              {selectedZone.name}
            </Typography>
            <View className="flex-0">
              <ZoneBadge label={selectedZone.udrId} />
            </View>
          </FlexRow>
        </Panel>

        <Link asChild href="/zone/photo" onPress={onZonePick}>
          <ContinueButton />
        </Link>
      </>
    )
  }

  return (
    // height needs to be fixed because the dynamic bottom sheet height is shrunk
    <Panel className="min-h-[56px] bg-warning-light g-2">
      <Typography>{t('zone.notSelected')}</Typography>
    </Panel>
  )
}

export default MapZoneBottomSheetPanel
