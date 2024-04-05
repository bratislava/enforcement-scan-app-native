import { router, useLocalSearchParams } from 'expo-router'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { ScanResultEnum } from '@/modules/backend/openapi-generated'

type ScanResultSearchParams = {
  scanResult: ScanResultEnum
}

const getResultVariant = (result?: ScanResultEnum) => {
  switch (result) {
    case ScanResultEnum.NoViolation:
      return 'success'
    case ScanResultEnum.PaasParkingViolationDuplicity:
      return 'warning'
    default:
      return 'error'
  }
}

// TODO - texts
const ScanResultPage = () => {
  const { scanResult } = useLocalSearchParams<ScanResultSearchParams>()

  return (
    <ScreenViewCentered
      options={{ headerTransparent: true }}
      actionButton={
        scanResult === ScanResultEnum.NoViolation ? (
          <ContinueButton onPress={router.back}>{scanResult}</ContinueButton>
        ) : (
          <ContinueButton variant="negative" onPress={() => router.replace('/offence')}>
            {scanResult}
          </ContinueButton>
        )
      }
    >
      <ContentWithAvatar
        variant={getResultVariant(scanResult)}
        title={`${scanResult} - title`}
        text={`${scanResult} - text`}
        asMarkdown
      />
    </ScreenViewCentered>
  )
}

export default ScanResultPage
