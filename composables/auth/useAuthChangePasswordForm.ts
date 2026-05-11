import type { ChangePasswordRequest } from '~/types/api/auth'
import { isApiValidationError } from '~/utils/apiValidation'

export function useAuthChangePasswordForm() {
  const auth = useAuth()
  const { t } = useI18n()

  const apiError = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  const isSubmitting = ref(false)

  const onSubmit = async (values: ChangePasswordRequest) => {
    apiError.value = null
    successMessage.value = null

    try {
      isSubmitting.value = true
      await auth.changePassword(values)
      successMessage.value = t('auth.feedback.passwordChanged')
    } catch (e: any) {
      if (isApiValidationError(e)) throw e
      apiError.value = e?.message ?? t('auth.feedback.changeFailed')
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
