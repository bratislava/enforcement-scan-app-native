import 'core-js/stable/atob'

import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from 'react'

import { TorchState } from '@/components/camera/FlashlightBottomSheetAttachment'

export const FlashlightContext = createContext<{
  torch: TorchState
  setTorch: Dispatch<SetStateAction<TorchState>>
} | null>(null)

const FlashlightContextProvider = ({ children }: PropsWithChildren) => {
  const [torch, setTorch] = useState<TorchState>('off')

  return (
    <FlashlightContext.Provider value={{ torch, setTorch }}>{children}</FlashlightContext.Provider>
  )
}

export default FlashlightContextProvider
