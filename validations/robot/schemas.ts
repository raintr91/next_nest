import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { rules } from '~/validations/common/rules'
import { commonValidationMessages as cm } from '~/validations/common/messages'

export const robotUpsertSchema = toTypedSchema(
  z.object({
    name: rules.required().max(255, cm.maxLength(255)),
    type: rules.required().max(255, cm.maxLength(255)),
    serial_number: rules.required().max(255, cm.maxLength(255)),
    status: z.coerce.number().int().min(0).max(1)
  })
)
