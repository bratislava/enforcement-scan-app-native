import { router } from 'expo-router'

import SelectList from '@/components/inputs/SelectList'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import { OFFENCE_TYPES } from '@/modules/backend/constants/offenceTypes'
import { OffenceTypeEnum } from '@/modules/backend/openapi-generated'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const Page = () => {
  const offenceType = useOffenceStoreContext((state) => state.offenceType)
  const setState = useSetOffenceState()

  const onOffenceTypeChange = async (newoffenceType: OffenceTypeEnum) => {
    if (newoffenceType !== offenceType) {
      setState({ offenceType: newoffenceType })
    }

    if (router.canGoBack()) {
      router.back()
    }
  }

  return (
    <ScreenView title="Vyberte typ priestupku">
      <ScreenContent>
        <SelectList<OffenceTypeEnum>
          options={OFFENCE_TYPES}
          value={offenceType}
          onSelect={onOffenceTypeChange}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
