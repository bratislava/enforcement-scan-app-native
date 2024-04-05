import { router } from 'expo-router'

import SelectList from '@/components/inputs/SelectList'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import { RESOLUTION_TYPES } from '@/modules/backend/constants/resolutionTypes'
import { ResolutionOffenceTypeEnum } from '@/modules/backend/openapi-generated'
import { useOffenceStoreContext } from '@/state/OffenceStore/useOffenceStoreContext'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const Page = () => {
  const resolutionType = useOffenceStoreContext((state) => state.resolutionType)
  const setState = useSetOffenceState()

  const onResultTypeChange = async (newResolutionType: ResolutionOffenceTypeEnum) => {
    if (newResolutionType !== resolutionType) {
      setState({ resolutionType: newResolutionType })
    }

    if (router.canGoBack()) {
      router.back()
    }
  }

  return (
    <ScreenView title="Vyberte typ vyriešenia">
      <ScreenContent>
        <SelectList<ResolutionOffenceTypeEnum>
          options={RESOLUTION_TYPES}
          value={resolutionType}
          onSelect={onResultTypeChange}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
