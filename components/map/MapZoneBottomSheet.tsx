import BottomSheet from '@gorhom/bottom-sheet'
import { forwardRef, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { MapRef } from '@/components/map/Map'
import MapZoneBottomSheetAttachment from '@/components/map/MapZoneBottomSheetAttachment'
import MapZoneBottomSheetPanel from '@/components/map/MapZoneBottomSheetPanel'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import Typography from '@/components/shared/Typography'
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { MapUdrZoneWithTranslationProps } from '@/modules/map/types'
import { cn } from '@/utils/cn'

type Props = {
  zone: MapUdrZoneWithTranslationProps | null
  setFlyToCenter?: MapRef['setFlyToCenter']
  isZoomedOut?: boolean
}

const MapZoneBottomSheet = forwardRef<BottomSheet, Props>(
  ({ zone: selectedZone, setFlyToCenter, isZoomedOut }, ref) => {
    const localRef = useRef<BottomSheet>(null)

    const refSetter = useMultipleRefsSetter(ref, localRef)

    const { t } = useTranslation()
    const animatedPosition = useSharedValue(0)

    return (
      <>
        <MapZoneBottomSheetAttachment {...{ animatedPosition, setFlyToCenter }} />
        <BottomSheet
          key="mapZoneBottomSheet"
          ref={refSetter}
          keyboardBehavior="interactive"
          handleComponent={BottomSheetHandleWithShadow}
          animatedPosition={animatedPosition}
          onClose={localRef.current?.expand}
          enableDynamicSizing
        >
          <BottomSheetContent isDynamic className={cn('bg-white', selectedZone ? 'g-2' : 'g-3')}>
            {isZoomedOut ? (
              <View className="flex-col items-center">
                <Typography className="text-center">{t('zone.zoomIn')}</Typography>
              </View>
            ) : (
              <MapZoneBottomSheetPanel selectedZone={selectedZone} />
            )}
          </BottomSheetContent>
        </BottomSheet>
      </>
    )
  },
)

export default MapZoneBottomSheet
