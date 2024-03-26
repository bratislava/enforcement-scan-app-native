// Inspired by https://jfranciscosousa.com/blog/validating-environment-variables-with-zod/
// Secures typesafe access to environmental variables.
// In browser process.env is an empty object, the values are replaced during the build time, so they need to be accessed
// via process.env.EXPO_PUBLIC...

/* eslint-disable no-process-env */
function assertEnv<T>(variable: string, value: T) {
  if (!value) {
    throw new Error(`Missing environment variable: ${variable}`)
  }

  return value
}

export const environment = {
  nodeEnv: assertEnv('NODE_ENV', process.env.NODE_ENV),
  mapboxPublicKey: assertEnv('EXPO_PUBLIC_MAPBOX_KEY', process.env.EXPO_PUBLIC_MAPBOX_KEY),
  clientId: assertEnv('EXPO_PUBLIC_CLIENT_ID', process.env.CLIENT_ID),
  tenantId: assertEnv('EXPO_PUBLIC_TENANT_ID', process.env.TENANT_ID),
}
