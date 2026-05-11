import type { ResetPasswordRequest } from '~/types/api/auth'
import { isApiValidationError } from '~/utils/apiValidation'

export function useAuthResetPasswordForm() {
  const auth = useAuth()
  const { t } = useI18n()

  const apiError = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  const isSubmitting = ref(false)

  const onSubmit = async (values: ResetPasswordRequest) => {
    apiError.value = null
    successMessage.value = null

    try {
      isSubmitting.value = true
      await auth.resetPassword(values)
      successMessage.value = t('auth.feedback.passwordUpdated')
      await navigateTo('/auth/login')
    } catch (e: any) {
      if (isApiValidationError(e)) throw e
      apiError.value = e?.message ?? t('auth.feedback.updateFailed')
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
