import { describe, expect, it } from 'vitest'
import { getTotalPages } from '~/components/molecules/data-display/dataIteratorLogic'

describe('molecules/data-display/dataIteratorLogic', () => {
  describe('getTotalPages', () => {
    it('returns 0 when total is undefined', () => {
      expect(getTotalPages(undefined, 10)).toBe(0)
    })
    it('returns 0 when total is null', () => {
      expect(getTotalPages(null as unknown as number, 10)).toBe(0)
    })
    it('returns 0 when pageSize is 0 or negative', () => {
      expect(getTotalPages(25, 0)).toBe(0)
      expect(getTotalPages(25, -1)).toBe(0)
    })
    it('returns 0 when total is 0', () => {
      expect(getTotalPages(0, 10)).toBe(0)
    })
    it('returns 1 when total <= pageSize', () => {
      expect(getTotalPages(1, 10)).toBe(1)
      expect(getTotalPages(10, 10)).toBe(1)
    })
    it('ceil division for multiple pages', () => {
      expect(getTotalPages(25, 10)).toBe(3)
      expect(getTotalPages(31, 10)).toBe(4)
      expect(getTotalPages(100, 10)).toBe(10)
    })
  })
})
