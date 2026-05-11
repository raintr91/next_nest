import { afterEach, describe, expect, it, vi } from 'vitest'
import { formatDateRange } from '~/components/molecules/pickers/rangeDatePickerFieldLogic'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('molecules/pickers/rangeDatePickerFieldLogic', () => {
  describe('formatDateRange', () => {
    it('returns "Pick range" when range is undefined', () => {
      expect(formatDateRange(undefined)).toBe('Pick range')
    })
    it('returns "Pick range" when start and end are empty', () => {
      expect(formatDateRange({})).toBe('Pick range')
      expect(formatDateRange({ start: '', end: '' })).toBe('Pick range')
    })
    it('formats start only with end as …', () => {
      const r = formatDateRange({ start: '2025-01-15', end: undefined })
      expect(r).toContain('2025')
      expect(r).toContain('…')
    })
    it('formats end only with start as …', () => {
      const r = formatDateRange({ start: undefined, end: '2025-02-20' })
      expect(r).toContain('…')
      expect(r).toContain('2025')
    })
    it('formats both start and end with – separator', () => {
      const r = formatDateRange({ start: '2025-01-15', end: '2025-01-20' })
      expect(r).toMatch(/\d.*–.*\d/)
    })

    it('returns fallback when date formatting throws', () => {
      const spy = vi.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(() => {
        throw new Error('format error')
      })
      expect(formatDateRange({ start: '2025-01-15', end: '2025-01-20' })).toBe('Pick range')
      expect(spy).toHaveBeenCalled()
    })
  })
})
