import { describe, expect, it } from 'vitest'

import {
  SampleItemReadSchema,
  SampleItemListResponseSchema
} from '@portal/models/sample-item'

describe('models/sample-item', () => {
  const validRow = {
  "id": 1,
  "name": "Contract gen pilot A",
  "managers": [
    {
      "id": 101,
      "full_name": "Manager A"
    }
  ]
} as const

  it('parses a valid row', () => {
    expect(SampleItemReadSchema.parse(validRow)).toEqual(validRow)
  })

  it('parses list response envelope', () => {
    const payload = { items: [validRow], total: 1 }
    expect(SampleItemListResponseSchema.parse(payload)).toEqual(payload)
  })

  it('rejects row missing required field', () => {
    const { id: _removed, ...incomplete } = validRow
    expect(() => SampleItemReadSchema.parse(incomplete)).toThrow()
  })
})
