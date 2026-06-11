import type { LoginRequest } from '~/models/auth/auth.types'
import { useApiForm } from '~/composables/forms/useApiForm'
import { loginSchema } from '~/validations/auth/schemas'

export function useAuthLoginForm() {
  const route = useRoute()
  const auth = useAuth()
  const { t } = useI18n()

  return useApiForm<LoginRequest>({
    validationSchema: loginSchema,
    initialValues: { email: '', password: '' },
    getErrorMessage: (error) => (error as Error)?.message ?? t('auth.feedback.loginFailed'),
    submit: async (values) => {
      await auth.login(values)
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
      await navigateTo(redirect)
    }
  })
}
