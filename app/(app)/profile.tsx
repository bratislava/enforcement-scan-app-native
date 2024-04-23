import { useTranslation } from 'react-i18next'

import AvatarCirclePerson from '@/components/info/AvatarCirclePerson'
import ActionRow from '@/components/list-rows/ActionRow'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import PressableStyled from '@/components/shared/PressableStyled'
import { useSignOut } from '@/modules/auth/hooks/useSignOut'
import { useAuthStoreContext } from '@/modules/auth/state/useAuthStoreContext'

const ProfilePage = () => {
  const signOut = useSignOut()
  const { user } = useAuthStoreContext()
  const { t } = useTranslation()

  if (!user) return <ErrorScreen />

  return (
    <ScreenView title={t('profile.title')}>
      <ScreenContent>
        <ContentWithAvatar
          customAvatarComponent={<AvatarCirclePerson />}
          title={user.name}
          text={user.email}
        />

        <PressableStyled onPress={signOut}>
          <ActionRow startIcon="logout" label={t('profile.logout')} variant="negative" />
        </PressableStyled>
      </ScreenContent>
    </ScreenView>
  )
}

export default ProfilePage
