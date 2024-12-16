import { router } from 'expo-router'

import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'

export const useStepper = () => {
  const currentStep = useOffenceStoreContext((state) => state.currentStep)
  const steps = useOffenceStoreContext((state) => state.steps)

  const onNextStep = () => {
    if (!steps) return

    const currentStepIndex = steps.findIndex((step) => step.path === currentStep?.path)
    const nextStep = steps[currentStepIndex + 1]

    if (nextStep) {
      router.navigate(nextStep.path)
    }
  }

  return { onNextStep }
}
