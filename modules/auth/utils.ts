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
  return null
  // }
}
