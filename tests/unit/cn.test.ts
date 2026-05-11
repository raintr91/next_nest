import { describe, expect, it } from 'vitest'
import { cn } from '~/utils/cn'

describe('utils/cn', () => {
  it('merges tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('accepts conditional classes', () => {
    expect(cn('p-2', false && 'hidden', true && 'block')).toContain('block')
  })
})
