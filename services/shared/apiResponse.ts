import type { ApiResponse } from '~/models/common/api.types'

export function assertApiSuccess<T>(res: ApiResponse<T>): asserts res is Extract<ApiResponse<T>, { success: true }> {
  if (!('success' in res) || res.success !== true) {
    throw res
  }
}
