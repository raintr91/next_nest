import { describe, expect, it } from 'vitest'
import { assertApiSuccess } from '~/services/shared/apiResponse'

describe('assertApiSuccess', () => {
  it('passes when response is successful', () => {
    const res = { success: true as const, data: { id: 1 } }
    expect(() => assertApiSuccess(res)).not.toThrow()
  })

  it('throws when response is an API error', () => {
    const res = { success: false as const, message: 'Invalid' }
    expect(() => assertApiSuccess(res)).toThrow()
  })
})
