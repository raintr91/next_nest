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
    async exportReport(body: Record<string, unknown>): Promise<void> {
      const res = await apiFetch<ApiResponse<{ ok: boolean }>>('/hotels/export-report', {
        method: 'POST',
        body
      })
      assertApiSuccess(res)
    },
    async loginFromAdmin(body: { id: number }) {
      const res = await apiFetch<ApiResponse<{
        token: string
        user_name: string
        hotel_name: string
        use_restaurant: boolean | null
        user_id: number
      }>>('/auth/store/login-from-admin', {
        method: 'POST',
        body
      })
      assertApiSuccess(res)
      return res.data
    }
  }
}

export type ChainHotelService = ReturnType<typeof createChainHotelService>
