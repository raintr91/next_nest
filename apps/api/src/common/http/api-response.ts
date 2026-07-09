export const ApiError = {
  STATUS_BAD_REQUEST: 400,
  STATUS_UNAUTHORIZED: 401,
  STATUS_FORBIDDEN: 403,
  STATUS_NOT_FOUND: 404,
  STATUS_UNPROCESSABLE_ENTITY: 422,
  STATUS_INTERNAL_SERVER_ERROR: 500,
  SUCCESS_MESSAGE: 'Success',
  DEFAULT_ERROR: 'Error',
  VALIDATION_ERROR: 'Validation Error',
  UNAUTHENTICATED: 'Unauthenticated',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  INTERNAL_SERVER_ERROR: 'Internal Server Error'
} as const

export type ApiSuccessPayload<T = unknown> = {
  success: true
  code: number
  message: string
  user_message?: string | null
  data: T
  meta?: Record<string, unknown> | null
  trace_id?: string | null
}

export type ApiErrorPayload = {
  success: false
  code: number
  error: string
  message: string
  user_message?: string | null
  errors?: unknown
  trace_id?: string | null
  debug?: unknown
}

export function successPayload<T>(
  data: T,
  message: string = ApiError.SUCCESS_MESSAGE,
  code = 200,
  meta?: Record<string, unknown> | null,
  traceId?: string | null
): ApiSuccessPayload<T> {
  return {
    success: true,
    code,
    message,
    user_message: null,
    data,
    meta: meta ?? null,
    trace_id: traceId ?? null
  }
}

export function errorPayload(
  code: number,
  error: string,
  message?: string,
  errors?: unknown,
  traceId?: string | null
): ApiErrorPayload {
  return {
    success: false,
    code,
    error,
    message: message ?? error,
    user_message: null,
    errors,
    trace_id: traceId ?? null,
    debug: null
  }
}

export function errorLabelFromStatus(status: number): string {
  switch (status) {
    case ApiError.STATUS_UNAUTHORIZED:
      return ApiError.UNAUTHENTICATED
    case ApiError.STATUS_FORBIDDEN:
      return ApiError.FORBIDDEN
    case ApiError.STATUS_NOT_FOUND:
      return ApiError.NOT_FOUND
    case ApiError.STATUS_UNPROCESSABLE_ENTITY:
      return ApiError.VALIDATION_ERROR
    case ApiError.STATUS_INTERNAL_SERVER_ERROR:
      return ApiError.INTERNAL_SERVER_ERROR
    default:
      return ApiError.DEFAULT_ERROR
  }
}
