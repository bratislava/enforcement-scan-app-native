export type GlobalContextProps = {
  signUpPhone: string | null
  user: {
    name: string
    email: string
    roles: string[]
  } | null
  isLoading: boolean
}

export type User = {
  name: string
  email: string
  roles: string[]
}
