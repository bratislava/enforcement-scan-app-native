module.exports = {
  expo: {
    name: 'Skenovacia aplikácia',
    slug: 'enforcement-scan-app',
    scheme: 'enforcement-scan-app',
    version: '1.3.3',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#16254C',
    },
    assetBundlePatterns: ['**/*'],
    android: {
      package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE_NAME || 'com.bratislava.enforcement',
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#ffffff',
      },
    },
    experiments: {
      tsconfigPaths: true,
    },
    plugins: [
      'expo-router',
      'expo-font',
      'react-native-vision-camera',
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsImpl: 'mapbox',
          RNMapboxMapsDownloadToken: process.env.MAPBOX_SECRET_TOKEN,
        },
      ],
      [
        'expo-updates',
        {
          username: 'bratislava',
        },
      ],
      [
        'expo-location',
        {
          locationWhenInUsePermission: 'Show current location on map.',
        },
      ],
      [
        '@sentry/react-native/expo',
        {
          organization: 'bratislava-city-hall',
          project: 'enforcement-scan-app',
          url: 'https://sentry.io/',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: '28f73650-074c-4565-94ac-c5cbe5b9658f',
      },
    },
    updates: {
      url: 'https://u.expo.dev/28f73650-074c-4565-94ac-c5cbe5b9658f',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    owner: 'bratislava',
  },
}
