import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import { fields } from '~/models/common/fields'

export const adminHotelCreateObjectSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
})

export const adminHotelCreateSchema = toTypedSchema(adminHotelCreateObjectSchema)
