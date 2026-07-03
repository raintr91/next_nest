import {
  AdminHotelCreatedSchema,
  AdminHotelListResponseSchema
} from '~/models/admin-hotel/admin-hotel.schema'
import type {
  AdminHotelCreateRequest,
  AdminHotelCreated,
  AdminHotelListResponse
} from '~/models/admin-hotel/admin-hotel.types'
import type { ApiResponse } from '~/models/common/api.types'
import { assertApiSuccess } from '~/services/shared/apiResponse'
import { parseApiData } from '~/services/shared/parseApiData'

type ApiFetch = <T>(url: string, options?: Record<string, unknown>) => Promise<T>

export type AdminHotelSearchParams = Record<string, unknown> & {
  page?: number
  per_page?: number
}

export function createAdminHotelService(apiFetch: ApiFetch) {
  return {
    async search(params?: AdminHotelSearchParams): Promise<AdminHotelListResponse> {
      const res = await apiFetch<ApiResponse<unknown>>('/hotels', {
        method: 'GET',
        query: params
      })
      assertApiSuccess(res)
      return parseApiData(AdminHotelListResponseSchema, res.data)
    },
    async create(payload: AdminHotelCreateRequest): Promise<AdminHotelCreated> {
      const res = await apiFetch<ApiResponse<unknown>>('/hotels', {
        method: 'POST',
        body: payload
      })
      assertApiSuccess(res)
      return parseApiData(AdminHotelCreatedSchema, res.data)
    }
  }
}

export type AdminHotelService = ReturnType<typeof createAdminHotelService>
