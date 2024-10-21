import { forwardRef } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { Camera, CameraProps, useCameraDevice, useCameraFormat } from 'react-native-vision-camera'

import FlashlightToggleButton from '@/components/camera/FlashlightToggleButton'
import { NoDeviceError } from '@/components/camera/NoDeviceError'
import { useAppState } from '@/hooks/useAppState'
import { useIsFocused } from '@/hooks/useIsFocused'
import { useFlashlightContext } from '@/modules/camera/state/useFlashlightContext'

const ASPECT_RATIO = 16 / 9
const photoWidth = 720

const FullScreenCamera = forwardRef<Camera, Omit<Partial<CameraProps>, 'device'>>((props, ref) => {
  const focused = useIsFocused()
  const appState = useAppState()
  const { width } = useWindowDimensions()

  const { torch } = useFlashlightContext()
  const device = useCameraDevice('back')

  const resolution = { width: photoWidth, height: photoWidth * ASPECT_RATIO }
  const format = useCameraFormat(device, [
    {
      photoAspectRatio: ASPECT_RATIO,
      photoResolution: resolution,
      videoResolution: resolution,
    },
  ])

  if (!device) return <NoDeviceError />

  return (
    <View className="relative">
      {/* This is equivalent to isActive={focused && appState === 'active'} but this approach kills camera when phone is locked, so it uses less resources */}
      {focused && appState === 'active' ? (
        <Camera
          ref={ref}
          isActive
          photo
          format={format}
          torch={torch}
          onError={(error) => console.error('Camera error', error)}
          device={device}
          style={{ height: width * ASPECT_RATIO }}
          {...props}
        />
      ) : null}

      <FlashlightToggleButton />
    </View>
  )
})

export default FullScreenCamera
