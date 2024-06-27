import { router, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { ScanResultEnum } from '@/modules/backend/openapi-generated'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { cn } from '@/utils/cn'

type AvailableScanResults = 'PAAS_PARKING_VIOLATION' | 'PAAS_PARKING_VIOLATION_DUPLICITY'

type ScanResultSearchParams = {
  scanResult: AvailableScanResults
}

const getResultVariant = (result?: AvailableScanResults) => {
  if (result === ScanResultEnum.PaasParkingViolation) return 'error'

  return 'warning'
}

const ScanResultPage = () => {
  const { t } = useTranslation()
  const { scanResult } = useLocalSearchParams<ScanResultSearchParams>()

  const ecv = useOffenceStoreContext((state) => state.ecv)

  if (!scanResult) {
    return <ErrorScreen text={t('scanResult.unsuccessful')} />
  }

  const scanResultTextsMap = {
    [ScanResultEnum.PaasParkingViolationDuplicity]: {
      title: t('scanResult.duplicity.title'),
      text: t('scanResult.duplicity.text'),
      infoText: t('scanResult.duplicity.infoText', { ecv }),
      buttonText: t('scanResult.duplicity.buttonText'),
    },
    [ScanResultEnum.PaasParkingViolation]: {
      title: t('scanResult.offence.title'),
      text: t('scanResult.offence.text'),
      infoText: t('scanResult.offence.infoText', { ecv }),
      buttonText: t('scanResult.offence.buttonText'),
    },
  }

  return (
    <ScreenViewCentered
      options={{ headerTransparent: true }}
      actionButton={
        <ContinueButton variant="negative" onPress={() => router.replace('/offence')}>
          {scanResultTextsMap[scanResult].buttonText}
        </ContinueButton>
      }
    >
      <ScreenContent className="justify-center">
        <ContentWithAvatar
          variant={getResultVariant(scanResult)}
          title={scanResultTextsMap[scanResult].title}
          text={scanResultTextsMap[scanResult].text}
          asMarkdown
        />

        <Panel
          className={cn('px-5', {
            'bg-warning-light': scanResult === ScanResultEnum.PaasParkingViolationDuplicity,
            'bg-negative-light': scanResult === ScanResultEnum.PaasParkingViolation,
          })}
        >
          <Typography className="text-center">{scanResultTextsMap[scanResult].infoText}</Typography>
          <Typography variant="h2" className="text-center font-source-500medium">
            {ecv}
          </Typography>
        </Panel>
      </ScreenContent>
    </ScreenViewCentered>
  )
}

export default ScanResultPage
