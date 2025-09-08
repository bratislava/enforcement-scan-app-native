import { useMutation } from '@tanstack/react-query'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import Field from '@/components/inputs/Field'
import SelectButton from '@/components/inputs/SelectButton'
import TextInput from '@/components/inputs/TextInput'
import SelectRow from '@/components/list-rows/SelectRow'
import { ChangeZoneModal } from '@/components/map/location-map/ChangeZoneModal'
import LocationMapPreview from '@/components/map/location-map/LocationMapPreview'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import PressableStyled from '@/components/shared/PressableStyled'
import { DuplicityModal } from '@/components/special/DuplicityModal'
import { useOffenceValidation } from '@/hooks/useOffenceValidation'
import { clientApi } from '@/modules/backend/client-api'
import { getOffenceTypeLabel } from '@/modules/backend/constants/offenceTypes'
import { getResolutionTypeLabel } from '@/modules/backend/constants/resolutionTypes'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'
import { sanitizeLicencePlate } from '@/utils/sanitizeLicencePlate'

type ModalType = 'duplicity' | 'changeZone' | null

const OffencePage = () => {
  const { t } = useTranslation()

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

  const [touched, setTouched] = useState(false)
  const [shownModal, setShownModal] = useState<ModalType>(null)

  const { isOutsideZone, isOutsideOriginalZone, hasEmptyFields } = useOffenceValidation()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!(ecv && scanData)) {
        throw new Error('Missing required data')
      }

      let scanResponse

      // Update scan if ECV was updated manually
      if (scanData.ecv !== ecv) {
        scanResponse = await clientApi.scanControllerCreateOrUpdateScanEcv({
          ...scanData,
          ecv,
          ecvUpdatedManually: true,
          udr: scanData.udr ?? undefined,
          streetName: scanData.streetName ?? undefined,
        })
      }

      const duplicityResponse = await clientApi.scanControllerGetOffenceList(
        ecv,
        undefined,
        undefined,
        location?.lat,
        location?.long,
      )

      return { scanResponseData: scanResponse?.data, duplicityResponseData: duplicityResponse.data }
    },
    onSuccess: ({ duplicityResponseData, scanResponseData }) => {
      if (scanResponseData) {
        setOffenceState({
          scanData: scanResponseData,
        })
      }

      if (duplicityResponseData?.length > 0) {
        setShownModal('duplicity')

        return
      }
      router.navigate('/offence/vehicle')
    },
  })

  const handleCloseModal = () => setShownModal(null)

  const handleLicencePlateChange = (newLicencePlate: string) => {
    setOffenceState({ ecv: sanitizeLicencePlate(newLicencePlate) })
  }

  const onContinue = () => {
    setTouched(true)

    if (hasEmptyFields || isOutsideZone) {
      return
    }

    if (isOutsideOriginalZone) {
      setShownModal('changeZone')

      return
    }

    mutate()
  }

  return (
    <DismissKeyboard>
      <ScreenView
        title={t('offence.title')}
        className="flex-1 justify-start"
        actionButton={<ContinueButton loading={isPending} onPress={onContinue} />}
      >
        <ScrollView alwaysBounceHorizontal={false}>
          <ScreenContent>
            <Field
              label={t('offence.vehicle')}
              errorMessage={touched && !ecv ? t('offence.required') : undefined}
            >
              <TextInput
                value={ecv}
                hasError={touched && !ecv}
                autoCapitalize="characters"
                className="font-source-500medium text-[24px] leading-[28px] text-black"
                isDisabled={!!role?.actions.scanCheck}
                onChangeText={handleLicencePlateChange}
              />
            </Field>

            <Field
              label={t('offence.location')}
              errorMessage={touched && isOutsideZone ? t('offence.outOfZone') : undefined}
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
              errorMessage={touched && !offenceType ? t('offence.required') : undefined}
            >
              <Link asChild href="/offence/offence-type">
                <SelectButton
                  hasError={touched && !offenceType}
                  value={offenceType ? getOffenceTypeLabel(offenceType) : undefined}
                  placeholder={t('offence.offenceTypePlaceholder')}
                />
              </Link>
            </Field>

            {isObjectiveResponsibility ? null : (
              <Field
                label={t('offence.offenceResolution')}
                errorMessage={touched && !resolutionType ? t('offence.required') : undefined}
              >
                <Link asChild href="/offence/resolution-type">
                  <SelectButton
                    hasError={touched && !resolutionType}
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

        <DuplicityModal visible={shownModal === 'duplicity'} onCloseModal={handleCloseModal} />
        <ChangeZoneModal visible={shownModal === 'changeZone'} onCloseModal={handleCloseModal} />
      </ScreenView>
    </DismissKeyboard>
  )
}

export default OffencePage
