import type { ApiResponse } from '~/models/common/api.types'
import { assertApiSuccess } from '~/services/shared/apiResponse'

type ApiFetch = <T>(url: string, options?: Record<string, unknown>) => Promise<T>

type SearchPayload = {
  items?: Record<string, unknown>[]
  data?: Record<string, unknown>[]
  list?: Record<string, unknown>[]
  rows?: Record<string, unknown>[]
  total?: number
}

export type DataSearchParams = {
  page: number
  per_page: number
}

export type DataSearchResult = {
  items: Record<string, unknown>[]
  total: number | null
}

function normalizeRows(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[]
  if (!payload || typeof payload !== 'object') return []

  const p = payload as SearchPayload
  if (Array.isArray(p.items)) return p.items
  if (Array.isArray(p.data)) return p.data
  if (Array.isArray(p.list)) return p.list
  if (Array.isArray(p.rows)) return p.rows
  return []
}

export function createDataService(apiFetch: ApiFetch) {
  return {
    async search(
      path: string,
      method: 'GET' | 'POST',
      params?: DataSearchParams
    ): Promise<DataSearchResult> {
      const fetchOptions: { method: 'GET' | 'POST'; body?: DataSearchParams } = { method }
      if (method === 'POST' && params) {
        fetchOptions.body = params
      }

      const res = await apiFetch<ApiResponse<unknown> & { meta?: { pagination?: { total?: number } } }>(
        `/api/${path}`,
        fetchOptions
      )
      assertApiSuccess(res)

      const items = normalizeRows(res.data)
      return {
        items,
        total: res.meta?.pagination?.total ?? items.length
      }
    }
  }
}

export type DataService = ReturnType<typeof createDataService>
