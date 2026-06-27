import { z } from 'zod'

import { fields } from '~/models/common/fields'

export const ChainHotelSchema = z.object({
  id: fields.id,
  name: fields.optionalNullableString,
  managers: z.array(z.object({ id: fields.id, full_name: fields.optionalNullableString })),
})

export const ChainHotelListSchema = z.array(ChainHotelSchema)

export const ChainHotelListResponseSchema = z.object({
  items: ChainHotelListSchema,
  total: z.number().optional()
})
