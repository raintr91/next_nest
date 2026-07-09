import { z } from 'zod'

import { fields } from '../common/fields.js'

export const SampleItemReadSchema = z.object({
  id: fields.id,
  name: fields.optionalNullableString,
  managers: z.array(z.object({
  id: fields.id,
  full_name: fields.optionalNullableString,
})).optional(),
})

export const SampleItemListSchema = z.array(SampleItemReadSchema)

export const SampleItemListResponseSchema = z.object({
  items: SampleItemListSchema,
  total: z.number().optional()
})
