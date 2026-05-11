import { describe, expect, it } from 'vitest'
import {
  getSparklineMax,
  getSparklineHeights
} from '~/components/molecules/data-display/sparklineBarsLogic'

describe('molecules/data-display/sparklineBarsLogic', () => {
  describe('getSparklineMax', () => {
    it('returns 1 for empty array', () => {
      expect(getSparklineMax([])).toBe(1)
    })
    it('returns at least 1 for any values', () => {
      expect(getSparklineMax([0, 0])).toBe(1)
      expect(getSparklineMax([0.1])).toBe(1)
    })
    it('returns max of values', () => {
      expect(getSparklineMax([10, 20, 5])).toBe(20)
      expect(getSparklineMax([100])).toBe(100)
    })
  })

  describe('getSparklineHeights', () => {
    it('returns empty for empty values', () => {
      expect(getSparklineHeights([], 10)).toEqual([])
    })
    it('returns percentages of max', () => {
      expect(getSparklineHeights([10, 20, 50], 50)).toEqual([20, 40, 100])
      expect(getSparklineHeights([5, 10], 10)).toEqual([50, 100])
    })
    it('handles zero max (avoids division issues)', () => {
      expect(getSparklineHeights([1, 2], 0)).toEqual([0, 0])
    })
  })
})
