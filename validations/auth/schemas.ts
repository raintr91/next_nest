import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import type { LoginRequest } from '~/models/auth/auth.types'
import { authValidationMessages as m } from '~/validations/auth/messages'
import { rules } from '~/validations/common/rules'
import { commonValidationMessages as cm } from '~/validations/common/messages'

const email = rules.email(m.emailInvalid)
const password = z.string().min(8, m.passwordMin8).max(128, cm.maxLength(128))

const loginObjectSchema = z.object({
  email,
  password
})

export const loginSchema = toTypedSchema(loginObjectSchema)

export type { LoginRequest }

export const registerSchema = toTypedSchema(
  z
    .object({
      name: z.string().optional(),
      email,
      password,
      password_confirmation: z.string().min(8, m.passwordMin8).max(128, cm.maxLength(128))
    })
    .refine((v) => v.password === v.password_confirmation, {
      message: m.passwordMismatch,
      path: ['password_confirmation']
    })
)

export const forgotPasswordSchema = toTypedSchema(
  z.object({
    email
  })
)

export const resetPasswordSchema = toTypedSchema(
  z
    .object({
      email,
      token: rules.required(m.tokenRequired),
      password,
      password_confirmation: z.string().min(8, m.passwordMin8).max(128, cm.maxLength(128))
    })
    .refine((v) => v.password === v.password_confirmation, {
      message: m.passwordMismatch,
      path: ['password_confirmation']
    })
)

export const changePasswordSchema = toTypedSchema(
  z
    .object({
      current_password: rules.required(m.currentPasswordRequired),
      password,
      password_confirmation: z.string().min(8, m.passwordMin8).max(128, cm.maxLength(128))
    })
    .refine((v) => v.password === v.password_confirmation, {
      message: m.passwordMismatch,
      path: ['password_confirmation']
    })
)

// Backward-compatible wrapper (older imports can keep using this)
export function useAuthSchemas() {
  return {
    loginSchema,
    registerSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema
  }
}
