import type { RegisterRequest } from '~/types/api/auth'
import { isApiValidationError } from '~/utils/apiValidation'

export function useAuthRegisterForm() {
  const auth = useAuth()
  const { t } = useI18n()

  const apiError = ref<string | null>(null)

  const isSubmitting = ref(false)

  const onSubmit = async (values: RegisterRequest) => {
    apiError.value = null
    try {
      isSubmitting.value = true
      await auth.register(values)
      await navigateTo('/')
    } catch (e: any) {
      if (isApiValidationError(e)) throw e
      apiError.value = e?.message ?? t('auth.feedback.registerFailed')
      throw e
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    apiError,
    isSubmitting,
    onSubmit
  }
}
