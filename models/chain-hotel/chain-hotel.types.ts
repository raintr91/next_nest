import type { z } from 'zod'

import type {
  ChainHotelListResponseSchema,
  ChainHotelSchema
} from '~/models/chain-hotel/chain-hotel.schema'

export type ChainHotel = z.infer<typeof ChainHotelSchema>
export type ChainHotelListResponse = z.infer<typeof ChainHotelListResponseSchema>
