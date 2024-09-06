/* eslint-disable no-await-in-loop */
import { PortalHost } from '@gorhom/portal'
import * as FileSystem from 'expo-file-system'
import * as Location from 'expo-location'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MapScreen from '@/components/map/MapScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import MapStoreProvider from '@/modules/map/state/MapStoreProvider/MapStoreProvider'

const initializeFile = async (fileName: string) => {
  const fileUri = `${FileSystem.documentDirectory}${fileName}`

  try {
    await FileSystem.writeAsStringAsync(fileUri, '', { encoding: FileSystem.EncodingType.UTF8 })
    // console.log(`File ${fileName} created successfully`)

    return fileUri
  } catch (error) {
    console.error('Error creating file:', error)
    throw error
  }
}

const getLocation = async (isLast: boolean) => {
  try {
    if (isLast) {
      // console.log('last known')

      return await Location.getLastKnownPositionAsync()
    }

    // console.log('current')

    return await Location.getCurrentPositionAsync()
  } catch (error) {
    console.error('Error getting location:', error)
    throw error
  }
}

const logLocationToFile = async (fileUri: string, isLast: boolean) => {
  try {
    const timestamp = new Date()
    const location = (await getLocation(isLast)) || {
      timestamp: '',
      coords: {
        latitude: '',
        longitude: '',
        accuracy: '',
        speed: '',
        heading: '',
        altitude: '',
        altitudeAccuracy: '',
      },
    }

    const locationData = `${location.coords.latitude},${location.coords.longitude},${location.coords.accuracy},${location.coords.speed},${location.coords.heading},${location.coords.altitude},${location.coords.altitudeAccuracy},${
      Date.now() - timestamp.getTime()
    },${new Date(location.timestamp).toISOString()}\n`

    let fileContent = ''
    try {
      fileContent = await FileSystem.readAsStringAsync(fileUri)
    } catch (error) {
      console.log('File does not exist yet. It will be created.')
    }

    // Append the new location data to the existing content
    fileContent += locationData

    console.log(fileContent)

    await FileSystem.writeAsStringAsync(fileUri, fileContent, {
      encoding: FileSystem.EncodingType.UTF8,
    })
    // console.log(`${isLast ? 'Last known' : ''}Location logged successfully`, locationData)
  } catch (error) {
    console.error('Error logging location:', error)
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 2000)
  }) // Wait for 5 seconds
}

const ZoneScreen = () => {
  const { t } = useTranslation()
  const { top } = useSafeAreaInsets()

  useEffect(() => {
    const startLogging = async () => {
      try {
        const fileUri = await initializeFile('locations-current.txt')

        while (true) {
          await logLocationToFile(fileUri, false)
        }
      } catch (error) {
        console.error('Error during location logging:', error)
      }

      return null
    }

    startLogging()

    return () => {
      console.log('Cleaning up...')
    }
  }, [])

  useEffect(() => {
    const startLogging = async () => {
      try {
        const fileUri = await initializeFile('locations-last-known.txt')

        while (true) {
          await logLocationToFile(fileUri, true)
        }
      } catch (error) {
        console.error('Error during location logging:', error)
      }

      return null
    }

    startLogging()

    return () => {
      console.log('Cleaning up...')
    }
  }, [])

  return (
    <MapStoreProvider>
      <ScreenView title={t('zone.title')} className="h-full flex-1 flex-col">
        <MapScreen />

        <View className="absolute right-0 px-2.5 g-3" style={{ top }}>
          <PortalHost name="mapRightBox" />
        </View>
      </ScreenView>
    </MapStoreProvider>
  )
}

export default ZoneScreen
