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

1. Go to github and create new release. For production the tag should start with `prod` (`prod1.2.1`), for staging `staging` (`staging1.2.1`) and for a development build `dev` (`dev1.2.1`).

The version number in the tag becomes the app version. Staging and dev builds get a suffix so it is obvious they are not a production release:

| tag | app version |
| --- | --- |
| `prod1.8.0` | `1.8.0` |
| `staging1.8.0` | `1.8.0-rc` |
| `dev1.8.0` | `1.8.0-dev` |

The Android version code is incremented automatically by EAS, so neither needs to be edited by hand before tagging. The `version` in `package.json` is only a placeholder (`0.0.0-dev`) — the release workflow overwrites it from the tag, so it is never the version of a released build, only of a local one.

### Play Store

Release to play store needs the .aab file build, the github release above submits app version to the play store so only thing that needs to be done is:

2. Go to the play store console and submit the release.

### InTune

Release to InTune needs to be built like .apk file which requires different build profile and also some tweaks because of InTune and Play store cannot have the same package name. All of this is done by environment variable and github actions in release.

3. Go to expo build and download it.

4. Send the apk file to people responsible for distribution of InTune application

### Testing builds

A `staging` tag also builds a sideloadable .apk next to the .aab that goes to the Play Store. It uses the package name `com.bratislava.enforcement.staging`, so it installs alongside the Play version instead of clashing with it. Download it from the expo build page.

A `dev` tag builds a development build (.apk) against the dev backend. Install it to use the dev client launcher with `yarn start`.

## OTA Update

Whenever there is occurrence of changes that needs to be delivered ASAP the OTA update is best choice for that. Only javascript changes can be delivered this way — anything touching native code needs a full build.

OTA updates are wired up **for production only**. In Github Releases create a tag that starts with `prod` and contains `ota` (`prod1.2.1-ota`). The tag has to start with `prod`, otherwise the workflow does not run at all.

There is no OTA path for staging or dev — those tags always run a full build.

The version in the tag has to match the version of the build you are updating. Updates are matched by runtime version, which follows the app version, so `prod1.2.1-ota` only reaches installs of `1.2.1`.

## Force update

We can force users to update application by calling `/system/version` POST endpoint with newest version which will open "Update App" modal

> [!WARNING]
> Beware of wrong version posting to the endpoint, the app wont work if the version is newer than released version

## Environment variables

Public ones available in the final frontend package go to `.env` prefixed with `EXPO_PUBLIC_`. Access them using `environment.ts`. Secrets go to Expo secrets (and are afterwards available in app.config.js - and probably elsewhere - as environment variables) - see Expo secrets docs.

## Run Tests

Tests are made with Maestro testing library and to execute them you need to have maestro installed

Install maestro [macOS](https://maestro.mobile.dev/getting-started/installing-maestro/macos)

```bash
brew install maestro
```

Install maestro [windows](https://maestro.mobile.dev/getting-started/installing-maestro/windows)

```bash
curl -fsSL "https://get.maestro.mobile.dev" | bash
```

Run test (login)

```bash
maestro test .maestro/login.yaml
```
