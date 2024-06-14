import BottomSheet from '@gorhom/bottom-sheet'
import { forwardRef, useRef } from 'react'
import { useSharedValue } from 'react-native-reanimated'

import { MapRef } from '@/components/map/Map'
import MapZoneBottomSheetAttachment from '@/components/map/MapZoneBottomSheetAttachment'
import ContinueButton from '@/components/navigation/ContinueButton'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'

type Props = {
  isDisabled?: boolean
  onPress: () => void
  setFlyToCenter?: MapRef['setFlyToCenter']
}

const LocationMapBottomSheet = forwardRef<BottomSheet, Props>(
  ({ setFlyToCenter, isDisabled, onPress }, ref) => {
    const localRef = useRef<BottomSheet>(null)
    const refSetter = useMultipleRefsSetter(ref, localRef)

    const animatedPosition = useSharedValue(0)

    return (
      <>
        <MapZoneBottomSheetAttachment {...{ animatedPosition, setFlyToCenter }} />

        <BottomSheet
          key="mapZoneBottomSheet"
          ref={refSetter}
          onClose={localRef.current?.expand}
          keyboardBehavior="interactive"
          handleComponent={BottomSheetHandleWithShadow}
          animatedPosition={animatedPosition}
          enableDynamicSizing
        >
          <BottomSheetContent>
            <ContinueButton disabled={isDisabled} onPress={onPress} />
          </BottomSheetContent>
        </BottomSheet>
      </>
    )
  },
)

export default LocationMapBottomSheet
