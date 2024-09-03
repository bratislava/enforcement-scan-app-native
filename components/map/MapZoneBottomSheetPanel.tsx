import * as FileSystem from 'expo-file-system'
import { Link } from 'expo-router'
import * as Sharing from 'expo-sharing'
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

const shareFileContent = async (fileName: string) => {
  try {
    const fileUri = `${FileSystem.documentDirectory}${fileName}`
    console.log('Sharing file:', fileUri)

    const result = await Sharing.isAvailableAsync()

    if (result) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Share File Contents',
      })
    }
  } catch (error) {
    console.error('Error sharing file:', error)
  }
}

const MapZoneBottomSheetPanel = ({ selectedZone }: Props) => {
  const { setOffenceState } = useSetOffenceState()
  const { t } = useTranslation()

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
        <ContinueButton onPress={() => shareFileContent('locations-current.txt')}>
          {t('map.saveCurrentFile')}
        </ContinueButton>
        <ContinueButton onPress={() => shareFileContent('locations-last-known.txt')}>
          {t('map.saveLastFile')}
        </ContinueButton>
      </>
    )
  }

  return (
    // height needs to be fixed because the dynamic bottom sheet height is shrunk
    <Panel className="min-h-[56px] bg-warning-light g-2">
      <Typography>Nie je zvolená zóna</Typography>
    </Panel>
  )
}

export default MapZoneBottomSheetPanel
