import { describe, expect, it } from 'vitest'
import { getDisplayText } from '~/components/molecules/form/autocompleteFieldLogic'
const options = [{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]
describe('molecules/form/autocompleteFieldLogic', () => {
  it('returns label when value matches', () => {
    expect(getDisplayText('a', options)).toBe('Option A')
  })
  it('returns value when no match', () => {
    expect(getDisplayText('custom', options)).toBe('custom')
  })
})
