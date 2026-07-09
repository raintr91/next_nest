import type { z } from 'zod'

import type {
  ChainHotelListResponseSchema,
  ChainHotelSchema
} from './chain-hotel.schema.js'

export type ChainHotel = z.infer<typeof ChainHotelSchema>
export type ChainHotelListResponse = z.infer<typeof ChainHotelListResponseSchema>
