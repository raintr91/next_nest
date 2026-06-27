import type { z } from 'zod'

import type {
  HotelListResponseSchema,
  HotelSchema
} from '~/models/hotel/hotel.schema'

export type Hotel = z.infer<typeof HotelSchema>
export type HotelListResponse = z.infer<typeof HotelListResponseSchema>
