import { describe, expect, it } from 'vitest'
import { getColClasses } from '~/components/molecules/layout/colLayout'

describe('molecules/layout/colLayout', () => {
  describe('getColClasses', () => {
    it('returns col-span-12 by default', () => {
      expect(getColClasses({})).toContain('col-span-12')
    })

    it('uses cols prop', () => {
      expect(getColClasses({ cols: 6 })).toContain('col-span-6')
      expect(getColClasses({ cols: 1 })).toContain('col-span-1')
    })

    it('adds responsive span classes when sm/md/lg/xl provided', () => {
      const c = getColClasses({ cols: 12, sm: 8, md: 6, lg: 4, xl: 3 })
      expect(c).toContain('col-span-12')
      expect(c).toContain('sm:col-span-8')
      expect(c).toContain('md:col-span-6')
      expect(c).toContain('lg:col-span-4')
      expect(c).toContain('xl:col-span-3')
    })

    it('adds offset class when offset 1-12', () => {
      expect(getColClasses({ cols: 6, offset: 2 })).toContain('col-start-2')
      expect(getColClasses({ cols: 6, offset: 12 })).toContain('col-start-12')
    })

    it('ignores offset when out of range', () => {
      const c = getColClasses({ cols: 6, offset: 0 })
      expect(c).not.toContain('col-start')
      const c2 = getColClasses({ cols: 6, offset: 13 })
      expect(c2).not.toContain('col-start-13')
    })

    it('merges custom class', () => {
      const c = getColClasses({ cols: 6, class: 'custom' })
      expect(c).toContain('custom')
    })

    it('falls back safely for invalid runtime spans', () => {
      const c = getColClasses({ cols: 99 as any, sm: 99 as any, md: 99 as any, lg: 99 as any, xl: 99 as any, offset: 99 })
      expect(c).toContain('col-span-12')
      expect(c).not.toContain('sm:col-span')
      expect(c).not.toContain('md:col-span')
      expect(c).not.toContain('lg:col-span')
      expect(c).not.toContain('xl:col-span')
      expect(c).not.toContain('col-start-99')
    })
  })
})
