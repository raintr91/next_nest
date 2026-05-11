import { describe, expect, it } from 'vitest'
import { parseCsvText } from '~/utils/csv'

describe('utils/csv', () => {
  it('returns empty result for blank input', () => {
    expect(parseCsvText('   \n\n')).toEqual({ headers: [], rows: [] })
  })

  it('parses headers and data rows', () => {
    const parsed = parseCsvText('email,full_name\nuser@example.com,Demo User\n')

    expect(parsed.headers).toEqual(['email', 'full_name'])
    expect(parsed.rows).toEqual([
      {
        email: 'user@example.com',
        full_name: 'Demo User'
      }
    ])
  })

  it('handles quoted values, escaped quotes, and blank lines', () => {
    const parsed = parseCsvText('email,company\n\n"user@example.com","Acme, Inc."\n"quoted@example.com","He said ""hello"""\n')

    expect(parsed.rows).toEqual([
      {
        email: 'user@example.com',
        company: 'Acme, Inc.'
      },
      {
        email: 'quoted@example.com',
        company: 'He said "hello"'
      }
    ])
  })

  it('strips BOM characters from the first header', () => {
    const parsed = parseCsvText('\uFEFFemail,status\nuser@example.com,1\n')

    expect(parsed.headers).toEqual(['email', 'status'])
  })

  it('throws when a quoted field is not closed', () => {
    expect(() => parseCsvText('email\n"user@example.com')).toThrow('CSV contains an unclosed quoted field.')
  })

  it('returns empty result when all rows are blank cells only', () => {
    expect(parseCsvText(',\n,\n')).toEqual({ headers: [], rows: [] })
  })

  it('skips empty header names while mapping data rows', () => {
    const parsed = parseCsvText('email,,status\nuser@example.com,ignore,active\n')
    expect(parsed.rows).toEqual([
      {
        email: 'user@example.com',
        status: 'active'
      }
    ])
  })

  it('fills missing columns with empty string', () => {
    const parsed = parseCsvText('email,status\nuser@example.com\n')
    expect(parsed.rows).toEqual([
      {
        email: 'user@example.com',
        status: ''
      }
    ])
  })
})