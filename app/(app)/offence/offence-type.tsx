import { router } from 'expo-router'

import SelectList from '@/components/inputs/SelectList'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import { OFFENCE_TYPES } from '@/modules/backend/constants/offenceTypes'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { OffenceTypeEnum } from '@/modules/backend/openapi-generated'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const Page = () => {
  const offenceType = useOffenceStoreContext((state) => state.offenceType)

  const roleKey = useOffenceStoreContext((state) => state.roleKey)
  const role = getRoleByKey(roleKey)

  const { setOffenceState } = useSetOffenceState()

  const onOffenceTypeChange = async (newOffenceType: OffenceTypeEnum) => {
    if (newOffenceType !== offenceType) {
      setOffenceState({ offenceType: newOffenceType })
    }

    if (router.canGoBack()) {
      router.back()
    }
  }

  const filteredOffenceOptions = role?.offenceTypes
    ? OFFENCE_TYPES.filter((offence) => role.offenceTypes?.includes(offence.value))
    : OFFENCE_TYPES

  return (
    <ScreenView title="Vyberte typ priestupku">
      <ScreenContent>
        <SelectList<OffenceTypeEnum>
          options={filteredOffenceOptions}
          value={offenceType}
          onSelect={onOffenceTypeChange}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
