import * as Location from 'expo-location'

import IconButton from '@/components/shared/IconButton'
import { useFlashlightContext } from '@/modules/camera/state/useFlashlightContext'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'

export type TorchState = 'on' | 'off'

const FlashlightToggleButton = () => {
  const [permissionStatus] = useCameraPermission()

  const { torch, setTorch } = useFlashlightContext()

  return (
    <IconButton
      className="absolute right-0 top-0 z-10 m-2.5"
      name={torch === 'off' ? 'flashlight-on' : 'flashlight-off'}
      accessibilityLabel="Flashlight"
      variant="white-raised"
      onPress={() => setTorch((prev) => (prev === 'off' ? 'on' : 'off'))}
      disabled={permissionStatus === Location.PermissionStatus.DENIED}
    />
  )
}

export default FlashlightToggleButton
