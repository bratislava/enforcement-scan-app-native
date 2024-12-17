import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import IconButton from '@/components/shared/IconButton'
import { SectionList } from '@/components/shared/SectionList'
import Typography from '@/components/shared/Typography'
import OffenceTypeTile from '@/components/tiles/RoleTile'
import { useAuthStoreContext } from '@/modules/auth/state/useAuthStoreContext'
import { ROLES } from '@/modules/backend/constants/roles'
import { OffenceTypeEnum } from '@/modules/backend/openapi-generated'
import { useStepper } from '@/modules/stepper/useStepper'
import { getDefaultOffenceStateByOffenceType } from '@/state/OffenceStore/getDefaultOffenceStateByOffenceType'
import { useSetOffenceState } from '@/state/OffenceStore/useSetOffenceState'

const AppRoute = () => {
  const { resetOffenceState } = useSetOffenceState()
  const { user } = useAuthStoreContext()
  const { t } = useTranslation()
  const { onNextStep } = useStepper()

  const handlePressRole = (offenceType: OffenceTypeEnum) => () => {
    resetOffenceState(getDefaultOffenceStateByOffenceType(offenceType))
    onNextStep()
  }

  const allowedRoles = ROLES.filter((role) => user?.roles.includes(role.key))

  const allowedOffenceTypes = allowedRoles.flatMap((role) => role.offenceTypes)

  if (allowedOffenceTypes.length === 0) {
    return (
      <EmptyStateScreen
        options={{
          headerTransparent: true,
          headerRight: () => (
            <IconButton
              name="person"
              accessibilityLabel={t('home.profile')}
              onPress={() => router.navigate('profile')}
            />
          ),
        }}
        title={t('home.title')}
        contentTitle={t('home.empty.title')}
        text={t('home.empty.text')}
      />
    )
  }

  const sections = allowedRoles.map((role) => ({
    title: role.key,
    data: role.offenceTypes,
  }))

  return (
    <ScreenView
      title={t('home.title')}
      options={{
        headerRight: () => (
          <IconButton
            name="person"
            testID="profile"
            accessibilityLabel={t('home.profile')}
            onPress={() => router.navigate('profile')}
          />
        ),
      }}
    >
      <ScreenContent>
        <SectionList
          sections={sections}
          renderSectionHeader={({ title }) => (
            <Typography variant="default-bold">{title}</Typography>
          )}
          renderItem={({ item }) => (
            <OffenceTypeTile key={item} value={item} onPress={handlePressRole(item)} />
          )}
          ItemSeparatorComponent={() => <View className="h-2" />}
          SectionSeparatorComponent={() => <Divider className="h-3 bg-transparent" />}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default AppRoute
