import BottomSheet from '@gorhom/bottom-sheet'
import { forwardRef } from 'react'
import { useSharedValue } from 'react-native-reanimated'

import { MapRef } from '@/components/map/Map'
import MapZoneBottomSheetAttachment from '@/components/map/MapZoneBottomSheetAttachment'
import ContinueButton from '@/components/navigation/ContinueButton'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'

type Props = {
  isDisabled?: boolean
  onPress: () => void
  setFlyToCenter?: MapRef['setFlyToCenter']
}

const LocationMapBottomSheet = forwardRef<BottomSheet, Props>(
  ({ setFlyToCenter, isDisabled, onPress }, ref) => {
    const animatedPosition = useSharedValue(0)

    return (
      <>
        <MapZoneBottomSheetAttachment {...{ animatedPosition, setFlyToCenter }} />

        <BottomSheet
          key="mapZoneBottomSheet"
          ref={ref}
          keyboardBehavior="interactive"
          handleComponent={BottomSheetHandleWithShadow}
          animatedPosition={animatedPosition}
          enableDynamicSizing
        >
          <BottomSheetContent className="min-h-[80px]">
            <ContinueButton disabled={isDisabled} onPress={onPress} />
          </BottomSheetContent>
        </BottomSheet>
      </>
    )
  },
)

export default LocationMapBottomSheet
