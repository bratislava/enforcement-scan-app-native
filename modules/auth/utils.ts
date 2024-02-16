// TODO: implement auth utils

export const getAccessTokenOrLogout = async () => {
  // try {
  //   const session = await fetchAuthSession()
  //   const { accessToken } = session.tokens ?? {}
  //   if (!accessToken) {
  //     throw new Error('no jwt token found in current session')
  //   }
  //   return accessToken
  // } catch (error) {
  //   console.log('error getting access token - redirect to login', error)
  //   router.replace('/onboarding')
  //   return null
  // }
}

/**
 * This helper function ignores error thrown by when not authenticated
 */
export const getCurrentAuthenticatedUser = async () => {
  // try {
  //   const user = await getCurrentUser()
  //   console.log(`The username: ${user.username}`)
  //   console.log(`The userId: ${user.userId}`)
  //   console.log(`The signInDetails:`, user.signInDetails)
  //   return user
  // } catch (error) {
  //   return null
  // }
}

export const signInAndRedirectToConfirm = async (phone: string) => {
  // const { isSignedIn, nextStep } = await signIn({
  //   username: phone,
  // })
  // console.log('signInOutput', { isSignedIn, nextStep })
  // if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
  //   /* Sign in result is needed for `confirmSignIn` function */
  //   router.push({ pathname: '/confirm-sign-in', params: { phone } })
  // }
  // if (nextStep.signInStep === 'DONE') {
  //   router.push({ pathname: '/confirm-sign-in', params: { phone } })
  // }
}
