import { Link, router } from 'expo-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import Field from '@/components/inputs/Field'
import SelectButton from '@/components/inputs/SelectButton'
import TextInput from '@/components/inputs/TextInput'
import SelectRow from '@/components/list-rows/SelectRow'
import LocationMapPreview from '@/components/map/location-map/LocationMapPreview'
import ContinueButton from '@/components/navigation/ContinueButton'
import { useModal } from '@/components/screen-layout/Modal/useModal'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import DismissKeyboard from '@/components/shared/DissmissKeyboard'
import PressableStyled from '@/components/shared/PressableStyled'
import { DuplicityModal } from '@/components/special/DuplicityModal'
import { clientApi } from '@/modules/backend/client-api'
import { getOffenceTypeLabel } from '@/modules/backend/constants/offenceTypes'
import { getResolutionTypeLabel } from '@/modules/backend/constants/resolutionTypes'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { OffenceTypeEnum } from '@/modules/backend/openapi-generated'
import { findContainingFeature } from '@/modules/map/utils/findContainingFeature'
import { useArcgisStoreContext } from '@/state/ArcgisStore/useArcgisStoreContext'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { sanitizeLicencePlate } from '@/utils/sanitizeLicencePlate'

const OffencePage = () => {
  const { t } = useTranslation()
  const { udrData } = useArcgisStoreContext()

  const {
    ecv,
    offenceType,
    roleKey,
    resolutionType,
    isObjectiveResponsibility,
    location,
    scanData,
  } = useOffenceStoreContext((state) => state)
  const { setOffenceState } = useSetOffenceState()
  const role = getRoleByKey(roleKey)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const { openModal, isModalVisible, closeModal } = useModal()

  const isLocationError = useMemo(
    () =>
      role?.actions.zone &&
      offenceType !== OffenceTypeEnum.Dz &&
      location &&
      udrData &&
      !findContainingFeature(udrData.features, [location.long, location.lat]),
    [role?.actions.zone, offenceType, location, udrData],
  )

  const onSubmit = async () => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setIsTouched(true)

    if (
      !(offenceType && (isObjectiveResponsibility || resolutionType) && ecv && scanData) ||
      isLocationError
    ) {
      setIsSubmitting(false)

      return
    }

    // Update scan if ECV was updated manually
    if (scanData.ecv !== ecv) {
      const scanResponse = await clientApi.scanControllerCreateOrUpdateScanEcv({
        ...scanData,
        ecv,
        ecvUpdatedManually: true,
        udr: scanData.udr ?? undefined,
        streetName: scanData.streetName ?? undefined,
      })

      if (scanResponse.data) {
        setOffenceState({
          scanData: scanResponse.data,
        })
      }
    }

    const response = await clientApi.scanControllerGetDuplicitOffence(
      ecv,
      undefined,
      undefined,
      location?.lat.toString(),
      location?.long.toString(),
    )

    if (response.data.length > 0) {
      openModal()
      setIsSubmitting(false)

      return
    }

    router.navigate('/offence/vehicle')
    setIsSubmitting(false)
    setIsTouched(false)
  }

  const handleLicencePlateChange = (newLicencePlate: string) => {
    setOffenceState({ ecv: sanitizeLicencePlate(newLicencePlate) })
  }

  return (
    <DismissKeyboard>
      <ScreenView
        title={t('offence.title')}
        className="flex-1 justify-start"
        actionButton={<ContinueButton loading={isSubmitting} onPress={onSubmit} />}
      >
        <ScrollView alwaysBounceHorizontal={false}>
          <ScreenContent>
            <Field label={t('offence.vehicle')}>
              <TextInput
                value={ecv}
                autoCapitalize="characters"
                className="font-belfast-700bold text-[18px] text-black"
                isDisabled={!!role?.actions.scanCheck}
                onChangeText={handleLicencePlateChange}
              />
            </Field>

            <Field
              label={t('offence.location')}
              errorMessage={isTouched && isLocationError ? t('offence.outOfZone') : undefined}
            >
              <PressableStyled
                onPress={() => {
                  router.navigate('/offence/location')
                }}
              >
                <LocationMapPreview />
              </PressableStyled>
            </Field>

            <Field
              label={t('offence.offenceType')}
              errorMessage={isTouched && !offenceType ? t('offence.required') : undefined}
            >
              <Link asChild href="/offence/offence-type">
                <SelectButton
                  hasError={isTouched && !offenceType}
                  value={offenceType ? getOffenceTypeLabel(offenceType) : undefined}
                  placeholder={t('offence.offenceTypePlaceholder')}
                />
              </Link>
            </Field>

            {isObjectiveResponsibility ? null : (
              <Field
                label={t('offence.offenceResolution')}
                errorMessage={isTouched && !resolutionType ? t('offence.required') : undefined}
              >
                <Link asChild href="/offence/resolution-type">
                  <SelectButton
                    hasError={isTouched && !resolutionType}
                    value={resolutionType ? getResolutionTypeLabel(resolutionType) : undefined}
                    placeholder={t('offence.offenceResolutionPlaceholder')}
                  />
                </Link>
              </Field>
            )}

            <SelectRow
              disabled={!role?.actions.subjective}
              label={t('offence.objectiveResponsibility')}
              onValueChange={() =>
                setOffenceState({
                  isObjectiveResponsibility: !isObjectiveResponsibility,
                })
              }
              value={isObjectiveResponsibility}
            />
          </ScreenContent>
        </ScrollView>

        <DuplicityModal visible={isModalVisible} onCloseModal={closeModal} />
      </ScreenView>
    </DismissKeyboard>
  )
}

export default OffencePage
