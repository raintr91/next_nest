import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { parseApiData } from '~/services/shared/parseApiData'

describe('parseApiData', () => {
  it('returns parsed data when schema matches', () => {
    const schema = z.object({ id: z.number() })
    expect(parseApiData(schema, { id: 1 })).toEqual({ id: 1 })
  })

  it('returns raw value when schema does not match', () => {
    const schema = z.object({ id: z.number() })
    const raw = { id: 'bad' }
    expect(parseApiData(schema, raw)).toBe(raw)
  })
})
