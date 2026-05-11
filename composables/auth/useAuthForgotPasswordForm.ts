import type { ForgotPasswordRequest } from '~/types/api/auth'
import { isApiValidationError } from '~/utils/apiValidation'

export function useAuthForgotPasswordForm() {
  const auth = useAuth()
  const { t } = useI18n()

  const apiError = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  const isSubmitting = ref(false)

  const onSubmit = async (values: ForgotPasswordRequest) => {
    apiError.value = null
    successMessage.value = null

    try {
      isSubmitting.value = true
      await auth.forgotPassword(values)
      successMessage.value = t('auth.feedback.forgotPasswordSent')
    } catch (e: any) {
      if (isApiValidationError(e)) throw e
      apiError.value = e?.message ?? t('auth.feedback.submitFailed')
      throw e
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    apiError,
    successMessage,
    isSubmitting,
    onSubmit
  }
}
