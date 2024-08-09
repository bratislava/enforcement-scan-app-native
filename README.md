# Enforcement scan app

Starting template for expo mobile app development under the city of Bratislava.
In general, follow https://docs.expo.dev/, below are some quick references.

## Product specification

[Product specification](https://magistratba.sharepoint.com/:w:/r/sites/Enforcement/_layouts/15/Doc.aspx?sourcedoc=%7BEBC17B4A-11F8-4897-80BF-5A10EB066269%7D&file=Nov%25u00e1%20skenovacia%20aplik%25u00e1cia%20HMBA_verzia%203.docx&action=default&mobileredirect=true)

## Connection with Expo

- You have to install eas-cli to connect and build project

```bash
npm install --global eas-cli
```

- Afterwards initiate

```bash
eas init --id {ID}
```

## Develop

We are using eas-development builds - read more here https://docs.expo.dev/develop/development-builds/introduction/

Quick reference:

```bash
# you'll want eas-cli installed globally
# install local packages
yarn

# local development once you have build installed and are changing only javascript
yarn start

# list existing builds (most of the time, you'll install the latest matching from here)
east build:list

# Android emulator or device build
eas build --profile development --platform android
```

## Build and Release

### Play Store

Release to play store needs the .aab file build, so the build needs to be done in this steps:

1. Build the app.

```bash
eas build --profile production --platform android --auto-submit
```

2. Go to play store internal testing (for now internal later it's gonna be different) and release the app

### InTune

Release to InTune needs to be built like .apk file which requires different build profile and also some tweaks because of InTune and Play store cannot have the same package name. The steps are like this:

1. Go to `app.config.js` and change `expo.android.package` field from "com.bratislava.enforcement" to "com.bratislava.enforcementscanapp"

2. Build the app.

```bash
eas build --profile production-apk --platform android
```

3. Change `expo.android.package` back to original string.

4. Go to expo build and download it.

5. Send the apk file to people responsible for distribution of InTune application

## Force update

We can force users to update application by calling `/system/version` POST endpoint with newest version which will open "Update App" modal

> [!WARNING]
> Beware of wrong version posting to the endpoint, the app wont work if the version is newer than released version

## Environment variables

Public ones available in the final frontend package go to `.env` prefixed with `EXPO_PUBLIC_`. Access them using `environment.ts`. Secrets go to Expo secrets (and are afterwards available in app.config.js - and probably elsewhere - as environment variables) - see Expo secrets docs.
