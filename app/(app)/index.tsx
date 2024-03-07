import { Text } from 'react-native'

import ScreenView from '@/components/screen-layout/ScreenView'

const AppRoute = () => {
  return (
    <ScreenView title="Index" className="flex-1 justify-start">
      <Text>AppRoute</Text>
    </ScreenView>
  )
}

export default AppRoute
