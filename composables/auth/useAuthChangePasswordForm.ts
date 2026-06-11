import type { ChangePasswordRequest } from '~/models/auth/auth.types'
import { useApiForm } from '~/composables/forms/useApiForm'
import { changePasswordSchema } from '~/validations/auth/schemas'

export function useAuthChangePasswordForm() {
  const auth = useAuth()
  const { t } = useI18n()
  const successMessage = ref<string | null>(null)

  const form = useApiForm<ChangePasswordRequest>({
    validationSchema: changePasswordSchema,
    initialValues: { current_password: '', password: '', password_confirmation: '' },
    getErrorMessage: (error) => (error as Error)?.message ?? t('auth.feedback.submitFailed'),
    submit: async (values) => {
      successMessage.value = null
      await auth.changePassword(values)
      successMessage.value = t('auth.feedback.passwordChanged')
    }
  })

  return {
    ...form,
    successMessage
  }
}
