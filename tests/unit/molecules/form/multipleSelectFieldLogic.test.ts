import { describe, expect, it } from 'vitest'
import {
  getDisplayText,
  toggleSelection
} from '~/components/molecules/form/multipleSelectFieldLogic'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' }
]
const placeholder = 'Select...'

describe('molecules/form/multipleSelectFieldLogic', () => {
  describe('getDisplayText', () => {
    it('returns placeholder when none selected', () => {
      expect(getDisplayText([], options, placeholder)).toBe('Select...')
    })
    it('returns single option label when one selected', () => {
      expect(getDisplayText(['a'], options, placeholder)).toBe('Option A')
      expect(getDisplayText(['b'], options, placeholder)).toBe('Option B')
    })
    it('returns value when one selected but not in options', () => {
      expect(getDisplayText(['x'], options, placeholder)).toBe('x')
    })
    it('returns "N selected" when multiple', () => {
      expect(getDisplayText(['a', 'b'], options, placeholder)).toBe('2 selected')
      expect(getDisplayText(['a', 'b', 'c'], options, placeholder)).toBe('3 selected')
    })
  })

  describe('toggleSelection', () => {
    it('adds value when checked', () => {
      expect(toggleSelection([], 'a', true)).toEqual(['a'])
      expect(toggleSelection(['a'], 'b', true)).toEqual(['a', 'b'])
    })
    it('removes value when unchecked', () => {
      expect(toggleSelection(['a', 'b'], 'a', false)).toEqual(['b'])
      expect(toggleSelection(['a'], 'a', false)).toEqual([])
    })
    it('no duplicate when already present', () => {
      expect(toggleSelection(['a'], 'a', true)).toEqual(['a'])
    })
  })
})
