import { useContext } from 'react'

import { FlashlightContext } from '@/modules/camera/state/FlashlightContextProvider'

export const useFlashlightContext = () => {
  const context = useContext(FlashlightContext)

  if (!context) {
    throw new Error('useFlashlightContext must be used within a FlashlightContextProvider')
  }

  return context
}
