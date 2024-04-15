import { router, useLocalSearchParams } from 'expo-router'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { ScanResultEnum } from '@/modules/backend/openapi-generated'

type ScanResultSearchParams = {
  scanResult: ScanResultEnum
}

const scanResultTextsMap: Record<ScanResultEnum, Record<string, string>> = {
  [ScanResultEnum.NoViolation]: {
    title: 'Bez priestupku',
    text: 'Bez priestupku - text',
    buttonText: 'Skenovať ďalší',
  },
  [ScanResultEnum.PaasParkingViolationDuplicity]: {
    title: 'Duplicita',
    text: 'Duplicita - text',
    buttonText: 'Skenovať ďalší',
  },
  [ScanResultEnum.PaasParkingViolation]: {
    title: 'Priestupok',
    text: 'Priestupok - text',
    buttonText: 'Vytvoriť nový priestupok',
  },
  [ScanResultEnum.Other]: {
    title: 'Iný dôvod',
    text: 'Iný dôvod - text',
    buttonText: 'Skenovať ďalší',
  },
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

  if (!scanResult) {
    return <ErrorScreen text="Nepodarilo sa načítať výsledok skenovania" />
  }

  return (
    <ScreenViewCentered
      options={{ headerTransparent: true }}
      actionButton={
        scanResult === ScanResultEnum.NoViolation ? (
          <ContinueButton onPress={router.back}>
            {scanResultTextsMap[scanResult].buttonText}
          </ContinueButton>
        ) : (
          <ContinueButton variant="negative" onPress={() => router.replace('/offence')}>
            {scanResultTextsMap[scanResult].buttonText}
          </ContinueButton>
        )
      }
    >
      <ContentWithAvatar
        variant={getResultVariant(scanResult as ScanResultEnum)}
        title={scanResultTextsMap[scanResult].title}
        text={scanResultTextsMap[scanResult].text}
        asMarkdown
      />
    </ScreenViewCentered>
  )
}

export default ScanResultPage
