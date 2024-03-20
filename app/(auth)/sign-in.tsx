import { useState } from 'react'

import LoginForm from '@/components/forms/LoginForm'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import DismissKeyboard from '@/components/shared/DissmissKeyboard'
import { useSignIn } from '@/modules/auth/hooks/useSignIn'

const Page = () => {
  const [error, setError] = useState<Error>()
  const signIn = useSignIn()

  const handleSignIn = async (data: { email: string; password: string }) => {
    try {
      await signIn(data)
    } catch (error) {
      setError(error)
    }
  }

  return (
    <DismissKeyboard>
      <ScreenView title="Prihláste sa">
        <ScreenContent>
          <LoginForm onSubmit={handleSignIn} error={error} />
        </ScreenContent>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default Page
