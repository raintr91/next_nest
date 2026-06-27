import {
  ChainHotelListResponseSchema
} from '~/models/chain-hotel/chain-hotel.schema'
import type { ChainHotelListResponse } from '~/models/chain-hotel/chain-hotel.types'
import type { ApiResponse } from '~/models/common/api.types'
import { assertApiSuccess } from '~/services/shared/apiResponse'
import { parseApiData } from '~/services/shared/parseApiData'

type ApiFetch = <T>(url: string, options?: Record<string, unknown>) => Promise<T>

export type ChainHotelSearchParams = Record<string, unknown> & {
  page?: number
  per_page?: number
}

export function createChainHotelService(apiFetch: ApiFetch) {
  return {
    async search(params?: ChainHotelSearchParams): Promise<ChainHotelListResponse> {
      const res = await apiFetch<ApiResponse<unknown>>('/hotels', {
        method: 'GET',
        query: params
      })
      assertApiSuccess(res)
      return parseApiData(ChainHotelListResponseSchema, res.data)
    },
    async exportReport(body: Record<string, unknown>): Promise<Blob> {
      return apiFetch<Blob>('/hotels/export-report', {
        method: 'POST',
        body,
        responseType: 'blob'
      })
    }
  }
}

export type ChainHotelService = ReturnType<typeof createChainHotelService>
