import { computed, ref } from 'vue'
import { vi } from 'vitest'

/**
 * Nuxt auto-imports used by portal-gen composables — stub for Vitest (#test-mock:nuxt-globals).
 * Composable tests reset `mockNuxtApiFetch` in beforeEach.
 */
export const mockNuxtApiFetch = vi.fn()

vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('useNuxtApp', () => ({ $apiFetch: mockNuxtApiFetch }))
