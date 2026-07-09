import { describe, expect, it } from 'vitest'

import {
  getAuthBypassPaths,
  getPageLifecycleEntry,
  isAuthBypassStage
} from '~/utils/page-lifecycle'

describe('page-lifecycle', () => {
  it('bypasses auth for all stages before wire', () => {
    expect(isAuthBypassStage('design-spec')).toBe(true)
    expect(isAuthBypassStage('prototype')).toBe(true)
    expect(isAuthBypassStage('test')).toBe(true)
    expect(isAuthBypassStage('wire')).toBe(false)
  })

  it('includes /hotels in auth bypass paths', () => {
    expect(getAuthBypassPaths()).toContain('/hotels')
  })

  it('resolves lifecycle entry by path', () => {
    const entry = getPageLifecycleEntry('/hotels')
    expect(entry?.stage).toBe('test')
    expect(entry?.spec).toContain('login-as')
  })
})
