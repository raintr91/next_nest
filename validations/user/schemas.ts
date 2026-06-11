import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { UserSchema } from '~/models/user/user.schema'
import { rules } from '~/validations/common/rules'
import { commonValidationMessages as cm } from '~/validations/common/messages'

/**
 * Form validation for user create/update pages (future CRUD).
 * Entity fields come from UserSchema; form rules add client-side constraints.
 * Import: `import { userUpsertSchema } from '~/validations/user/schemas'`
 */
const userUpsertObjectSchema = z.object({
  name: rules.required().max(255, cm.maxLength(255)),
  email: rules.email(),
  phone: rules.phone().optional(),
  status: UserSchema.shape.status,
  birthday: UserSchema.shape.birthday,
  gender: UserSchema.shape.gender
})

export const userUpsertSchema = toTypedSchema(userUpsertObjectSchema)

export type UserUpsertInput = z.infer<typeof userUpsertObjectSchema>
