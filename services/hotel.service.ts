import {
  HotelListResponseSchema
} from '~/models/hotel/hotel.schema'
import type { HotelListResponse } from '~/models/hotel/hotel.types'
import type { ApiResponse } from '~/models/common/api.types'
import { assertApiSuccess } from '~/services/shared/apiResponse'
import { parseApiData } from '~/services/shared/parseApiData'

type ApiFetch = <T>(url: string, options?: Record<string, unknown>) => Promise<T>

export type HotelSearchParams = Record<string, unknown> & {
  page?: number
  per_page?: number
}

export function createHotelService(apiFetch: ApiFetch) {
  return {
    async search(params?: HotelSearchParams): Promise<HotelListResponse> {
      const res = await apiFetch<ApiResponse<unknown>>('/api/hotels/search', {
        method: 'POST',
        body: params
      })
      assertApiSuccess(res)
      return parseApiData(HotelListResponseSchema, res.data)
    }
  }
}

export type HotelService = ReturnType<typeof createHotelService>
