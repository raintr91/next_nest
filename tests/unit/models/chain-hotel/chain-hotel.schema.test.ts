import { describe, expect, it } from 'vitest'

import {
  ChainHotelSchema,
  ChainHotelListResponseSchema
} from '~/models/chain-hotel/chain-hotel.schema'

describe('models/chain-hotel/chain-hotel.schema', () => {
  const validRow = {
  "id": 1,
  "name": "Chain — danh sách hotel (施設一覧) A",
  "managers": [
    {
      "id": 101,
      "full_name": "Manager A"
    }
  ]
} as const

  it('parses a valid row', () => {
    expect(ChainHotelSchema.parse(validRow)).toEqual(validRow)
  })

  it('parses list response envelope', () => {
    const payload = { items: [validRow], total: 1 }
    expect(ChainHotelListResponseSchema.parse(payload)).toEqual(payload)
  })

  it('rejects row missing required field', () => {
    const { id: _removed, ...incomplete } = validRow
    expect(() => ChainHotelSchema.parse(incomplete)).toThrow()
  })
})
