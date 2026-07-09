import { z } from 'zod'

import { fields } from '../common/fields.js'

export const HotelSchema = z.object({
  id: fields.id,
  name: fields.optionalNullableString,
  status: fields.status.optional(),
  created_at: fields.createdAt,
})

export const HotelListSchema = z.array(HotelSchema)

export const HotelListResponseSchema = z.object({
  items: HotelListSchema,
  total: z.number().optional()
})

export const HotelReadSchema = HotelSchema
