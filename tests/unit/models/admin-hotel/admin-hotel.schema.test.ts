import { describe, expect, it } from 'vitest'

import {
  AdminHotelSchema,
  AdminHotelListResponseSchema
} from '~/models/admin-hotel/admin-hotel.schema'

describe('models/admin-hotel/admin-hotel.schema', () => {
  const validRow = {
  "id": 1,
  "name": "Tạo hotel admin A",
  "managers": [
    {
      "id": 101,
      "full_name": "Manager A"
    }
  ]
} as const

  it('parses a valid row', () => {
    expect(AdminHotelSchema.parse(validRow)).toEqual(validRow)
  })

  it('parses list response envelope', () => {
    const payload = { items: [validRow], total: 1 }
    expect(AdminHotelListResponseSchema.parse(payload)).toEqual(payload)
  })

  it('rejects row missing required field', () => {
    const { id: _removed, ...incomplete } = validRow
    expect(() => AdminHotelSchema.parse(incomplete)).toThrow()
  })
})
