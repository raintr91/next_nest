import { describe, expect, it } from 'vitest'

import {
  resolveLifecycleStage,
  routePathFromPageFile
} from '../../../scripts/portal-gen/lib/page-lifecycle.mjs'

describe('page-lifecycle.mjs helpers', () => {
  it('maps page file to route path', () => {
    expect(routePathFromPageFile('pages/hotels/index.vue')).toBe('/hotels')
    expect(routePathFromPageFile('pages/admin/hotels/index.vue')).toBe('/admin/hotels')
  })

  it('does not downgrade stage by default', () => {
    expect(resolveLifecycleStage('prototype', 'wire')).toBe('wire')
  })

  it('allows downgrade when requested', () => {
    expect(resolveLifecycleStage('design-spec', 'prototype', { allowDowngrade: true })).toBe('design-spec')
  })
})
