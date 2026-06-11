import type { RegisterRequest } from '~/models/auth/auth.types'
import { useApiForm } from '~/composables/forms/useApiForm'
import { registerSchema } from '~/validations/auth/schemas'

export function useAuthRegisterForm() {
  const auth = useAuth()
  const { t } = useI18n()

  return useApiForm<RegisterRequest>({
    validationSchema: registerSchema,
    initialValues: { name: '', email: '', password: '', password_confirmation: '' },
    getErrorMessage: (error) => (error as Error)?.message ?? t('auth.feedback.registerFailed'),
    submit: async (values) => {
      await auth.register(values)
      await navigateTo('/')
    }
  })
}
