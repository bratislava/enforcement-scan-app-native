import * as WebBrowser from 'expo-web-browser'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import Typography from '@/components/shared/Typography'
import { useSignIn } from '@/modules/auth/hooks/useSignIn'

// https://docs.expo.dev/guides/authentication/#azure
WebBrowser.maybeCompleteAuthSession()

const Page = () => {
  const { t } = useTranslation()
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState(false)
  const { isReady, signIn } = useSignIn()

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn()
    } catch (error) {
      setError(error as Error)
    }
    setIsLoading(false)
  }

  return (
    <DismissKeyboard>
      <ScreenView title={t('signIn.title')}>
        <ScreenContent>
          {error?.message ? (
            <Typography className="py-4 text-negative">{error.message}</Typography>
          ) : null}

          <ContinueButton
            loading={isLoading}
            disabled={isLoading || !isReady}
            onPress={handleSignIn}
          >
            {t('signIn.loginButton')}
          </ContinueButton>
        </ScreenContent>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default Page
