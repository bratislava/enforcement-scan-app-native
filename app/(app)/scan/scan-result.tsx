import { router, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { ScanResultEnum } from '@/modules/backend/openapi-generated'

type AvailableScanResults = 'PAAS_PARKING_VIOLATION' | 'PAAS_PARKING_VIOLATION_DUPLICITY'

type ScanResultSearchParams = {
  scanResult: AvailableScanResults
}

const getResultVariant = (result?: AvailableScanResults) => {
  if (result === 'PAAS_PARKING_VIOLATION') return 'error'

  return 'warning'
}

// TODO - texts
const ScanResultPage = () => {
  const { t } = useTranslation()
  const { scanResult } = useLocalSearchParams<ScanResultSearchParams>()

  if (!scanResult) {
    return <ErrorScreen text={t('scanResult.unsuccessful')} />
  }

  const scanResultTextsMap = {
    [ScanResultEnum.PaasParkingViolationDuplicity]: {
      title: t('scanResult.duplicity.title'),
      text: t('scanResult.duplicity.text'),
      buttonText: t('scanResult.duplicity.buttonText'),
    },
    [ScanResultEnum.PaasParkingViolation]: {
      title: t('scanResult.offence.title'),
      text: t('scanResult.offence.text'),
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
      <ContentWithAvatar
        variant={getResultVariant(scanResult)}
        title={scanResultTextsMap[scanResult].title}
        text={scanResultTextsMap[scanResult].text}
        asMarkdown
      />
    </ScreenViewCentered>
  )
}

export default ScanResultPage
