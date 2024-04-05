import { router, useLocalSearchParams } from 'expo-router'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { ScanResultEnum } from '@/modules/backend/openapi-generated'

/*
 * Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=1300%3A11943&mode=dev
 */

type ScanResultSearchParams = {
  scanResult: ScanResultEnum
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
          <ContinueButton variant="negative" onPress={() => router.push('/offence')}>
            {scanResult}
          </ContinueButton>
        )
      }
    >
      <ContentWithAvatar
        variant={
          scanResult === ScanResultEnum.NoViolation
            ? 'success'
            : scanResult === ScanResultEnum.PaasParkingViolationDuplicity
              ? 'warning'
              : 'error'
        }
        title={`${scanResult} - title`}
        text={`${scanResult} - text`}
        asMarkdown
      />
    </ScreenViewCentered>
  )
}

export default ScanResultPage
