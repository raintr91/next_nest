import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import { fields } from '~/models/common/fields'

export const adminChainCreateObjectSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }).min(1).max(255, { message: "Name must be 255 characters or less." }),
    code: z.string().min(1, { message: "Code is required." }).min(1).max(255),
    master_user_chain: z.array(z.union([z.string(), z.number()])).min(1),
    notification_mail_address: z.string().max(255).regex(new RegExp("^[^@]+@[^@]+\\.[^@]+$"), { message: "Invalid email format." }).nullable().optional(),
  })

export const adminChainCreateSchema = toTypedSchema(adminChainCreateObjectSchema)
