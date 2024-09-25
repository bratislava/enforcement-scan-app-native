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

1. Go to github and create new release. For production the tag should start with `prod` (`prod1.2.1`) and for staging `staging` (`staging1.2.1`).

### Play Store

Release to play store needs the .aab file build, the github release above submits app version to the play store so only thing that needs to be done is:

2. Go to the play store console and submit the release.

### InTune

Release to InTune needs to be built like .apk file which requires different build profile and also some tweaks because of InTune and Play store cannot have the same package name. All of this is done by environment variable and github actions in release.

3. Go to expo build and download it.

4. Send the apk file to people responsible for distribution of InTune application

## OTA Update

Whenever there is occurrence of changes that needs to be delivered ASAP the OTA update is best choice for that.
In Github Releases create and start the tag with `ota` (`ota-prod1.2.1` or `ota-staging1.2.1`).

## Force update

We can force users to update application by calling `/system/version` POST endpoint with newest version which will open "Update App" modal

> [!WARNING]
> Beware of wrong version posting to the endpoint, the app wont work if the version is newer than released version

## Environment variables

Public ones available in the final frontend package go to `.env` prefixed with `EXPO_PUBLIC_`. Access them using `environment.ts`. Secrets go to Expo secrets (and are afterwards available in app.config.js - and probably elsewhere - as environment variables) - see Expo secrets docs.
