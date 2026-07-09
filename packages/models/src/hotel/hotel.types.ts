import type { z } from 'zod'

import type {
  HotelListResponseSchema,
  HotelSchema
} from './hotel.schema.js'

export type Hotel = z.infer<typeof HotelSchema>
export type HotelListResponse = z.infer<typeof HotelListResponseSchema>
