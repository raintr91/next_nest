export type BackendValidationErrors = Record<string, string[]>

export class ApiValidationError extends Error {
  readonly statusCode = 422
  readonly errors: BackendValidationErrors
  readonly data: unknown

  constructor(message: string, errors: BackendValidationErrors, data?: unknown) {
    super(message)
    this.name = 'ApiValidationError'
    this.errors = errors
    this.data = data
  }
}

export function isApiValidationError(error: unknown): error is ApiValidationError {
  return Boolean(error) && typeof error === 'object' && (error as any).name === 'ApiValidationError' && (error as any).statusCode === 422
}

export function flattenValidationErrors(errors: BackendValidationErrors): Record<string, string> {
  const flat: Record<string, string> = {}
  for (const [key, messages] of Object.entries(errors)) {
    if (!Array.isArray(messages) || messages.length === 0) continue
    flat[key] = String(messages[0])
  }
  return flat
}

/**
 * Extract Laravel-style 422 errors from various error shapes:
 * - ApiValidationError (thrown by our fetch handler)
 * - $fetch FetchError ({ statusCode, data: { errors } })
 */
export function extractValidationErrors(error: any): BackendValidationErrors | null {
  if (!error) return null

  if (isApiValidationError(error)) return error.errors

  const status = error?.statusCode ?? error?.response?.status
  const data = error?.data ?? error?.response?._data
  const maybeErrors = data?.errors

  if (status === 422 && maybeErrors && typeof maybeErrors === 'object') {
    return maybeErrors as BackendValidationErrors
  }

  return null
}

export function applyValidationErrorsToForm(
  error: unknown,
  setErrors: (errors: Record<string, string>) => void
): boolean {
  const extracted = extractValidationErrors(error as any)
  if (!extracted) return false
  setErrors(flattenValidationErrors(extracted))
  return true
}
