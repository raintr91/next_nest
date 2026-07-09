import { z } from 'zod'

import { fields } from '../common/fields.js'

export const AdminHotelSchema = z.object({
  id: fields.id,
  name: fields.optionalNullableString,
  code: fields.optionalNullableString,
  chain: fields.optionalNullableString,
  created_at: fields.createdAt,
  managers: z.array(z.object({ id: fields.id, full_name: fields.optionalNullableString })),
})

export const AdminHotelListSchema = z.array(AdminHotelSchema)

export const AdminHotelListResponseSchema = z.object({
  items: AdminHotelListSchema,
  total: z.number().optional()
})

export const AdminHotelCreateRequestSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
})

export const AdminHotelCreatedSchema = AdminHotelCreateRequestSchema.extend({
  id: fields.id,
  created_at: fields.createdAt
})

export const AdminHotelReadSchema = AdminHotelSchema
