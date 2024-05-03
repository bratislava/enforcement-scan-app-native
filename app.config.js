module.exports = {
  expo: {
    name: 'enforcement-scan-app',
    slug: 'enforcement-scan-app',
    scheme: 'enforcement-scan-app',
    version: '1.0.0',
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
      package: 'com.bratislava.enforcement',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    ios: {
      bundleIdentifier: 'com.bratislava.enforcement',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    experiments: {
      tsconfigPaths: true,
    },
    plugins: [
      'expo-router',
      'react-native-vision-camera',
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsImpl: 'mapbox',
          RNMapboxMapsDownloadToken: process.env.MAPBOX_SECRET_TOKEN,
        },
      ],
      [
        'expo-location',
        {
          locationWhenInUsePermission: 'Show current location on map.',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: '28f73650-074c-4565-94ac-c5cbe5b9658f',
      },
    },
    owner: 'bratislava',
  },
}
