/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-await-in-loop */
import { PortalHost } from '@gorhom/portal'
import * as FileSystem from 'expo-file-system'
import * as Location from 'expo-location'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MapScreen from '@/components/map/MapScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
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

const getLocation = async (isLast: boolean, accuracy: Location.LocationAccuracy) => {
  try {
    if (isLast) {
      // console.log('last known')

      return await Location.getLastKnownPositionAsync()
    }

    // console.log('current')

    return await Location.getCurrentPositionAsync({ accuracy })
  } catch (error) {
    console.error('Error getting location:', error)
    throw error
  }
}

const logLocationToFile = async (fileUri: string, isLast: boolean, accuracy: Location.Accuracy) => {
  try {
    const timestamp = new Date()
    const location = (await getLocation(isLast, accuracy)) || {
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

export const accuracyArray = [
  { name: 'Lowest', value: Location.Accuracy.Lowest },
  { name: 'Low', value: Location.Accuracy.Balanced },
  { name: 'Balanced', value: Location.Accuracy.Low },
  { name: 'High', value: Location.Accuracy.High },
  { name: 'Highest', value: Location.Accuracy.Highest },
  { name: 'BestForNavigation', value: Location.Accuracy.BestForNavigation },
]

const ZoneScreen = () => {
  const { t } = useTranslation()
  const { top } = useSafeAreaInsets()

  const [accuracy, setAccuracy] = useState(accuracyArray[2])

  useEffect(() => {
    let interval: NodeJS.Timeout
    const startLogging = async () => {
      try {
        const fileUri = await initializeFile('locations-current.txt')

        interval = setInterval(() => {
          logLocationToFile(fileUri, false, accuracy.value).catch(() => {})
        }, 2000)
      } catch (error) {
        console.error('Error during location logging:', error)
      }

      return null
    }

    startLogging()

    return () => {
      if (interval) clearInterval(interval)
      console.log('Cleaning up...')
    }
  }, [accuracy.value])

  useEffect(() => {
    let interval: NodeJS.Timeout
    const startLogging = async () => {
      try {
        const fileUri = await initializeFile('locations-last-known.txt')

        interval = setInterval(() => {
          logLocationToFile(fileUri, true, accuracy.value).catch(() => {})
        }, 2000)
      } catch (error) {
        console.error('Error during location logging:', error)
      }

      return null
    }

    startLogging()

    return () => {
      if (interval) clearInterval(interval)
      console.log('Cleaning up...')
    }
  }, [accuracy.value])

  return (
    <MapStoreProvider>
      <ScreenView title={t('zone.title')} className="h-full flex-1 flex-col">
        <Button
          onPress={() => {
            // set next accuracy
            const currentIndex = accuracyArray.findIndex((acc) => acc.value === accuracy.value)
            const nextIndex = (currentIndex + 1) % accuracyArray.length
            setAccuracy(accuracyArray[nextIndex])
          }}
        >
          {accuracy.name}
        </Button>

        <MapScreen />

        <View className="absolute right-0 px-2.5 g-3" style={{ top }}>
          <PortalHost name="mapRightBox" />
        </View>
      </ScreenView>
    </MapStoreProvider>
  )
}

export default ZoneScreen
