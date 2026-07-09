import type { z } from 'zod'

import type {
  AdminHotelCreateRequestSchema,
  AdminHotelCreatedSchema,
  AdminHotelListResponseSchema,
  AdminHotelSchema
} from './admin-hotel.schema.js'

export type AdminHotel = z.infer<typeof AdminHotelSchema>
export type AdminHotelListResponse = z.infer<typeof AdminHotelListResponseSchema>
export type AdminHotelCreateRequest = z.infer<typeof AdminHotelCreateRequestSchema>
export type AdminHotelCreated = z.infer<typeof AdminHotelCreatedSchema>
