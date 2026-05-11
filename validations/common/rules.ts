import { z } from 'zod'
import { commonValidationMessages as m } from '~/validations/common/messages'

function normalizeToString(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
}

export const rules = {
  required: (message: string = m.required) => z.string().min(1, message),

  maxLength: (max: number, message: string = m.maxLength(max)) => z.string().max(max, message),

  minLength: (min: number, message: string = m.minLength(min)) => z.string().min(min, message),

  email: (message: string = m.emailInvalid) => z.string().email(message),

  /**
   * Common phone rule:
   * - Accepts digits with spaces/hyphens/parentheses
   * - Allows optional leading +
   * - Normalizes input by stripping spaces/hyphens/parentheses
   */
  phone: (message: string = m.phoneInvalid) =>
    z
      .preprocess((v) => {
        const raw = normalizeToString(v)
        return raw.replace(/[\s\-()]/g, '')
      }, z.string())
      .refine((v) => v.length === 0 || /^\+?\d{9,15}$/.test(v), message)
} as const

/** Utility to compose multiple string rules. */
export function composeString(...schemas: Array<z.ZodTypeAny>) {
  return schemas.reduce((acc, schema) => acc.and(schema), z.string())
}
