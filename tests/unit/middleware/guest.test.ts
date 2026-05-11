import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createRouteGuardHandler } from '~/composables/useRouteGuard'

const mockCookieRef = { value: null as string | null }
const mockNavigateTo = vi.fn()

vi.mock('nuxt/app', () => ({
  useCookie: () => mockCookieRef
}))
vi.stubGlobal('navigateTo', mockNavigateTo)

/** Same options as middleware/guest.ts */
const GUEST_OPTIONS = {
  cookieName: 'auth_token',
  mode: 'guest' as const,
  redirectTo: '/',
  redirectQueryKey: 'redirect' as const
}

function route(path: string, fullPath?: string, query: Record<string, string> = {}) {
  const fp = fullPath ?? path
  return { path, fullPath: fp, query } as any
}

describe('middleware/guest', () => {
  beforeEach(() => {
    mockCookieRef.value = null
    mockNavigateTo.mockClear()
  })

  it('redirects to / when token exists (logged-in user on auth page)', () => {
    mockCookieRef.value = 'token'
    const handler = createRouteGuardHandler(GUEST_OPTIONS)
    handler(route('/auth/login'), route('/'))
    expect(mockNavigateTo).toHaveBeenCalledWith('/', { replace: true })
  })

  it('redirects to query.redirect when token exists', () => {
    mockCookieRef.value = 'token'
    const handler = createRouteGuardHandler(GUEST_OPTIONS)
    handler(route('/auth/login', '/auth/login', { redirect: '/dashboard' }), route('/'))
    expect(mockNavigateTo).toHaveBeenCalledWith('/dashboard', { replace: true })
  })

  it('allows access when no token (guest on auth page)', () => {
    const handler = createRouteGuardHandler(GUEST_OPTIONS)
    handler(route('/auth/login'), route('/'))
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })
})
