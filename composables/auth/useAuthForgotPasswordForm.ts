import type { ForgotPasswordRequest } from '~/models/auth/auth.types'
import { useApiForm } from '~/composables/forms/useApiForm'
import { forgotPasswordSchema } from '~/validations/auth/schemas'

export function useAuthForgotPasswordForm() {
  const auth = useAuth()
  const { t } = useI18n()
  const successMessage = ref<string | null>(null)

  const form = useApiForm<ForgotPasswordRequest>({
    validationSchema: forgotPasswordSchema,
    initialValues: { email: '' },
    getErrorMessage: (error) => (error as Error)?.message ?? t('auth.feedback.submitFailed'),
    submit: async (values) => {
      successMessage.value = null
      await auth.forgotPassword(values)
      successMessage.value = t('auth.feedback.forgotPasswordSent')
    }
  })

  return {
    ...form,
    successMessage
  }
}
