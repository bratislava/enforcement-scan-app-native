import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'

import SelectList from '@/components/inputs/SelectList'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import { getOffenceTypes } from '@/modules/backend/constants/queryOptions'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const Page = () => {
  const { t } = useTranslation()

  const offenceType = useOffenceStoreContext((state) => state.offenceType)

  const roleKey = useOffenceStoreContext((state) => state.roleKey)
  const role = getRoleByKey(roleKey)

  const { setOffenceState } = useSetOffenceState()

  const { data, isPending, isError, error } = useQuery(getOffenceTypes())

  const onOffenceTypeChange = async (newOffenceType: string) => {
    if (newOffenceType !== offenceType) {
      setOffenceState({ offenceType: newOffenceType })
    }

    if (router.canGoBack()) {
      router.back()
    }
  }

  if (isPending) {
    return <LoadingScreen title={t('offence.offenceType')} asScreenView />
  }

  if (isError) {
    return <ErrorScreen text={error?.message} />
  }

  const offenceTypeOptions = data.map(({ code: value, name }) => ({
    label: name,
    value,
  }))

  const filteredOffenceOptions = role?.offenceTypes
    ? offenceTypeOptions.filter((offence) => role.offenceTypes?.includes(offence.value))
    : offenceTypeOptions

  return (
    <ScreenView title="Vyberte typ priestupku">
      <ScreenContent>
        <SelectList<string>
          options={filteredOffenceOptions}
          value={offenceType}
          onSelect={onOffenceTypeChange}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
