import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ScanResultEnum } from '@/modules/backend/openapi-generated'
import {
  CROPPED_AREA_HEIGHT,
  HEADER_WITH_PADDING,
} from '@/modules/camera/hooks/useScanLicencePlate'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { cn } from '@/utils/cn'

export const LicencePlateCameraBackground = () => {
  const scanResult = useOffenceStoreContext((state) => state.scanResult)
  const { top } = useSafeAreaInsets()

  const backgroundClassName = cn('items-center bg-dark/75', {
    'bg-green/75': scanResult === ScanResultEnum.NoViolation,
    'bg-negative/75': scanResult === ScanResultEnum.PaasParkingViolation,
    'bg-warning/75': scanResult === ScanResultEnum.PaasParkingViolationDuplicity,
  })

  return (
    <View className="absolute h-full w-full" testID={scanResult}>
      <View
        style={{ paddingTop: top, height: HEADER_WITH_PADDING }}
        className={cn('justify-start', backgroundClassName)}
      />
      <View style={{ height: CROPPED_AREA_HEIGHT }} className="items-center" />
      <View className={cn('flex-1', backgroundClassName)} />
    </View>
  )
}
