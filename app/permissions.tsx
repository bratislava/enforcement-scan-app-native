import { PermissionStatus } from 'expo-camera'
import { router, Stack } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SceneRendererProps, TabView } from 'react-native-tab-view'

import { SlideLocationPermissions, SlideNotificationPermission } from '@/assets/permissions'
import InfoSlide from '@/components/screen-layout/InfoSlide'
import Button from '@/components/shared/Button'
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

  const [cameraPermissionStatus, getCameraPermission] = useCameraPermission()
  const [locationPermissionStatus, getLocationPermission] = useLocationPermission()

  const SvgImage = {
    camera: SlideNotificationPermission,
    location: SlideLocationPermissions,
  }[route.key]
  const permissionStatus =
    route.key === 'location' ? locationPermissionStatus : cameraPermissionStatus
  const getPermission = route.key === 'location' ? getLocationPermission : getCameraPermission
  const onPermissionFinished = useCallback(() => {
    if (route.key === 'camera') {
      jumpTo('location')
    } else {
      router.replace('/')
    }
  }, [route.key, jumpTo])

  useEffect(() => {
    if (permissionStatus !== PermissionStatus.UNDETERMINED) {
      onPermissionFinished()
    }
  }, [onPermissionFinished, permissionStatus])

  return (
    <View className="flex-1 justify-start">
      <InfoSlide title={route.title} text={route.title} SvgImage={SvgImage} />
      <Button
        variant="primary"
        className={cn('mx-5', { 'mb-5': !insets.bottom })}
        onPress={getPermission}
      >
        Pokračovať
      </Button>
    </View>
  )
}

const renderScene = (routeProps: RouteProps, activeKey: RouteKeys) => {
  return activeKey === routeProps.route.key ? <PermissionsRoute {...routeProps} /> : null
}

type RouteObj = {
  key: RouteKeys
  title: string
}

const PermissionsScreen = () => {
  const layout = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const [index, setIndex] = useState(0)
  const [routes] = useState<RouteObj[]>([
    { key: 'camera', title: 'Kamera' },
    { key: 'location', title: 'Poloha' },
  ])

  return (
    <View className="flex-1" style={{ paddingBottom: insets.bottom }}>
      <Stack.Screen options={{ headerShown: false }} />

      <TabView
        navigationState={{ index, routes }}
        renderScene={(props) => renderScene(props, routes[index].key)}
        onIndexChange={setIndex}
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
