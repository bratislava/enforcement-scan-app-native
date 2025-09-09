import { router, Stack } from 'expo-router'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SceneRendererProps, TabView } from 'react-native-tab-view'

import { SlideLocationPermissions, SlideNotificationPermission } from '@/assets/permissions'
import ContinueButton from '@/components/navigation/ContinueButton'
import InfoSlide from '@/components/screen-layout/InfoSlide'
import { useCameraPermission } from '@/modules/permissions/useCameraPermission'
import { useLocationPermission } from '@/modules/permissions/useLocationPermission'
import { cn } from '@/utils/cn'

type RouteKeys = 'camera' | 'location'
// key is nested inside router, because this is how `renderScene` provides it
// the type is generic and has to be manually set for handlers
type RouteProps = SceneRendererProps & {
  route: RouteObj
}

const PermissionsRoute = ({ route, jumpTo }: RouteProps) => {
  const insets = useSafeAreaInsets()

  const [, getCameraPermission] = useCameraPermission()
  const [, getLocationPermission] = useLocationPermission()

  const SvgImage = {
    camera: SlideNotificationPermission,
    location: SlideLocationPermissions,
  }[route.key]

  const getPermission = route.key === 'location' ? getLocationPermission : getCameraPermission

  const onRequestPermissions = useCallback(async () => {
    await getPermission()

    if (route.key === 'camera') {
      jumpTo('location')
    } else {
      router.replace('/')
    }
  }, [getPermission, route.key, jumpTo])

  return (
    <View className="flex-1 justify-start">
      <InfoSlide title={route.title} text={route.text} SvgImage={SvgImage} />

      <ContinueButton
        className={cn('mx-5', { 'mb-5': !insets.bottom })}
        onPress={onRequestPermissions}
      />
    </View>
  )
}

const renderScene = (routeProps: RouteProps, activeKey: RouteKeys) => {
  return activeKey === routeProps.route.key ? <PermissionsRoute {...routeProps} /> : null
}

type RouteObj = {
  key: RouteKeys
  title: string
  text: string
}

const PermissionsScreen = () => {
  const { t } = useTranslation()
  const layout = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const [index, setIndex] = useState(0)
  const [routes] = useState<RouteObj[]>([
    {
      key: 'camera',
      title: t('permissions.camera.screen.title'),
      text: t('permissions.camera.screen.text'),
    },
    {
      key: 'location',
      title: t('permissions.location.screen.title'),
      text: t('permissions.location.screen.text'),
    },
  ])

  return (
    <View className="flex-1" style={{ paddingBottom: insets.bottom }}>
      <Stack.Screen options={{ headerShown: false }} />

      <TabView
        navigationState={{ index, routes }}
        renderScene={(props) => renderScene(props, routes[index].key)}
        onIndexChange={setIndex}
        // calling router.replace() during the animation causes a crash
        animationEnabled={false}
        initialLayout={{ width: layout.width }}
        renderTabBar={() => null}
        tabBarPosition="bottom"
        className="pb-5"
        swipeEnabled={false}
        style={{ paddingTop: insets.top }}
      />
    </View>
  )
}

export default PermissionsScreen
