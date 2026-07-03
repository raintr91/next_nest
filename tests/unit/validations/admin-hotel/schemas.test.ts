import { describe, expect, it } from 'vitest'

import { adminHotelCreateObjectSchema } from '~/validations/admin-hotel/schemas'

describe('validations/admin-hotel/schemas', () => {
  const validForm = {
  "name": "sample-name",
  "code": "sample-code",
  "phone": "sample-phone",
  "address": "sample-address"
} as const

  it('parses valid create payload', () => {
    const result = adminHotelCreateObjectSchema.safeParse(validForm)
    expect(result.success).toBe(true)
  })

  it('rejects empty required field name', () => {
    const result = adminHotelCreateObjectSchema.safeParse({ ...validForm, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty required field code', () => {
    const result = adminHotelCreateObjectSchema.safeParse({ ...validForm, code: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty required field phone', () => {
    const result = adminHotelCreateObjectSchema.safeParse({ ...validForm, phone: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty required field address', () => {
    const result = adminHotelCreateObjectSchema.safeParse({ ...validForm, address: '' })
    expect(result.success).toBe(false)
  })
})
