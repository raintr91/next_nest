import { useForm } from 'vee-validate'
import type { GenericObject, TypedSchema } from 'vee-validate'

import { applyValidationErrorsToForm } from '~/utils/apiValidation'

type UseApiFormOptions<T extends GenericObject> = {
  validationSchema: TypedSchema<T>
  initialValues: T
  submit: (values: T) => Promise<void>
  getErrorMessage?: (error: unknown) => string
}

export function useApiForm<T extends GenericObject>(options: UseApiFormOptions<T>) {
  const apiError = ref<string | null>(null)

  const { handleSubmit, errors, setErrors, isSubmitting } = useForm<T>({
    validationSchema: options.validationSchema,
    initialValues: options.initialValues
  })

  const onSubmit = handleSubmit(async (values) => {
    apiError.value = null
    try {
      await options.submit(values)
    } catch (error) {
      if (applyValidationErrorsToForm(error, setErrors)) return
      apiError.value = options.getErrorMessage?.(error) ?? (error as Error)?.message ?? 'Submit failed'
      throw error
    }
  })

  return {
    apiError,
    errors,
    setErrors,
    isSubmitting,
    onSubmit
  }
}
