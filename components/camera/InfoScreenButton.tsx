import { Link } from 'expo-router'
import { useTranslation } from 'react-i18next'

import IconButton from '@/components/shared/IconButton'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'

export const InfoScreenButton = () => {
  const { t } = useTranslation()
  const generatedEcv = useOffenceStoreContext((state) => state.ecv)

  return generatedEcv ? (
    <Link href="/scan/info" className="absolute left-0 top-0 z-10 m-2.5">
      <IconButton
        name="info"
        accessibilityLabel={t('scanLicencePlate.infoButton.accessibility')}
        variant="white-raised"
      />
    </Link>
  ) : null
}
