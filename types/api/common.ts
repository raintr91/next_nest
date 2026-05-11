export type ApiSuccess<T> = {
  success: true
  message?: string
  data: T
  meta?: Record<string, unknown> | null
}

export type ApiError = {
  success: false
  message?: string
  errors?: Record<string, string[]>
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
