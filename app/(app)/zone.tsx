import { router } from 'expo-router'

import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenView from '@/components/screen-layout/ScreenView'

const AppRoute = () => {
  return (
    <ScreenView title="Zone" className="flex-1 justify-start">
      <ContinueButton onPress={() => router.push('zone-photo')} />
    </ScreenView>
  )
}

export default AppRoute
