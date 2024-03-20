import { JSONSchemaType } from 'ajv'
import { Controller } from 'react-hook-form'

import TextInput from '@/components/inputs/TextInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import Field from '@/components/shared/Field'
import Typography from '@/components/shared/Typography'
import useHookForm from '@/hooks/useHookForm'

interface Data {
  email: string
  password: string
}

interface Props {
  onSubmit: (data: Data) => Promise<void>
  error?: Error | null
}

const schema: JSONSchemaType<Data> = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      minLength: 1,
      format: 'email',
      errorMessage: { minLength: 'account:email_required', format: 'account:email_format' },
    },
    password: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'account:password_required' },
    },
  },
  required: ['email', 'password'],
}

const LoginForm = ({ onSubmit, error }: Props) => {
  const {
    handleSubmit,
    control,
    errors,
    formState: { isSubmitting },
  } = useHookForm<Data>({
    schema,
    defaultValues: { email: 'aaa@aaar.aa', password: 'aaaa' },
  })

  return (
    <>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Field label="Email" errorMessage={errors.email?.[0]}>
            <TextInput
              {...field}
              onChangeText={field.onChange}
              keyboardType="email-address"
              autoComplete="email"
              hasError={!!errors.email}
              placeholder="Email"
              autoFocus
              returnKeyType="done"
            />
          </Field>
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Field label="Password" errorMessage={errors.password?.[0]}>
            <TextInput
              {...field}
              onChangeText={field.onChange}
              autoComplete="password"
              secureTextEntry
              hasError={!!errors.password}
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          </Field>
        )}
      />

      {error?.message ? (
        <Typography className="py-4 text-negative">{error.message}</Typography>
      ) : null}

      <ContinueButton
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
    </>
  )
}

export default LoginForm
