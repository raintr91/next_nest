import { vi } from 'vitest'

export type MockApiFetch = ReturnType<typeof vi.fn>

/**
 * Injectable apiFetch double for service unit tests (#test-mock:api-fetch).
 * Pass the return value into createXxxService(mockApiFetch()).
 */
export function mockApiFetch<T = unknown>(response: T): MockApiFetch {
  return vi.fn().mockResolvedValue(response)
}

export function mockApiFetchReject(error: unknown): MockApiFetch {
  return vi.fn().mockRejectedValue(error)
}
