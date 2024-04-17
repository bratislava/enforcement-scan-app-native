import { router } from 'expo-router'

import SelectList from '@/components/inputs/SelectList'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import { RESOLUTION_TYPES } from '@/modules/backend/constants/resolutionTypes'
import { getRoleByKey } from '@/modules/backend/constants/roles'
import { ResolutionOffenceTypeEnum } from '@/modules/backend/openapi-generated'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const Page = () => {
  const resolutionType = useOffenceStoreContext((state) => state.resolutionType)

  const roleKey = useOffenceStoreContext((state) => state.roleKey)
  const role = getRoleByKey(roleKey)

  const { setOffenceState } = useSetOffenceState()

  const onResultTypeChange = async (newResolutionType: ResolutionOffenceTypeEnum) => {
    if (newResolutionType !== resolutionType) {
      setOffenceState({ resolutionType: newResolutionType })
    }

    if (router.canGoBack()) {
      router.back()
    }
  }

  const filteredResolutionTypes = role?.resolutionTypes
    ? RESOLUTION_TYPES.filter((offence) => role.resolutionTypes?.includes(offence.value))
    : RESOLUTION_TYPES

  return (
    <ScreenView title="Vyberte typ vyriešenia">
      <ScreenContent>
        <SelectList<ResolutionOffenceTypeEnum>
          options={filteredResolutionTypes}
          value={resolutionType}
          onSelect={onResultTypeChange}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
