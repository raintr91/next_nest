import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createRouteGuardHandler } from '~/composables/useRouteGuard'

const mockCookieRef = { value: null as string | null }
const mockNavigateTo = vi.fn()

vi.mock('nuxt/app', () => ({
  useCookie: () => mockCookieRef
}))
vi.stubGlobal('navigateTo', mockNavigateTo)

/** Same options as middleware/auth.ts */
const AUTH_OPTIONS = {
  cookieName: 'auth_token',
  mode: 'require' as const,
  skipPaths: ['/auth'],
  redirectTo: '/auth',
  redirectQueryKey: 'redirect' as const
}

function route(path: string, fullPath?: string) {
  const fp = fullPath ?? path
  return { path, fullPath: fp, query: {} } as any
}

describe('middleware/auth', () => {
  beforeEach(() => {
    mockCookieRef.value = null
    mockNavigateTo.mockClear()
  })

  it('redirects to /auth?redirect=... when no token and path not under /auth', () => {
    const handler = createRouteGuardHandler(AUTH_OPTIONS)
    handler(route('/settings'), route('/'))
    expect(mockNavigateTo).toHaveBeenCalledWith('/auth?redirect=%2Fsettings', { replace: true })
  })

  it('allows access when token exists', () => {
    mockCookieRef.value = 'token'
    const handler = createRouteGuardHandler(AUTH_OPTIONS)
    handler(route('/settings'), route('/'))
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('allows access to /auth and /auth/* without token (skipPaths)', () => {
    const handler = createRouteGuardHandler(AUTH_OPTIONS)
    handler(route('/auth'), route('/'))
    handler(route('/auth/login'), route('/'))
    expect(mockNavigateTo).not.toHaveBeenCalled()
  })
})
