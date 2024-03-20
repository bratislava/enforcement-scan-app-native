import { router } from 'expo-router'

import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenView from '@/components/screen-layout/ScreenView'

const AppRoute = () => {
  return (
    <ScreenView title="Zone photo" className="flex-1 justify-start">
      <ContinueButton onPress={() => router.push('camera')} />
    </ScreenView>
  )
}

export default AppRoute
