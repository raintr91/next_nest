import type { ResetPasswordRequest } from '~/models/auth/auth.types'
import { useApiForm } from '~/composables/forms/useApiForm'
import { resetPasswordSchema } from '~/validations/auth/schemas'

export function useAuthResetPasswordForm(initial?: Partial<Pick<ResetPasswordRequest, 'email' | 'token'>>) {
  const auth = useAuth()
  const { t } = useI18n()

  return useApiForm<ResetPasswordRequest>({
    validationSchema: resetPasswordSchema,
    initialValues: {
      email: initial?.email ?? '',
      token: initial?.token ?? '',
      password: '',
      password_confirmation: ''
    },
    getErrorMessage: (error) => (error as Error)?.message ?? t('auth.feedback.submitFailed'),
    submit: async (values) => {
      await auth.resetPassword(values)
      await navigateTo('/auth/login')
    }
  })
}
