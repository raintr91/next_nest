import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createRouteGuardHandler } from '~/composables/useRouteGuard'

const mockCookieRef = { value: null as string | null }
const mockNavigateTo = vi.fn()

vi.mock('nuxt/app', () => ({
  useCookie: (name: string) => {
    expect(name).toBeDefined()
    return mockCookieRef
  }
}))
vi.stubGlobal('navigateTo', mockNavigateTo)

function route(path: string, fullPath?: string, query: Record<string, string> = {}) {
  return {
    path,
    fullPath: fullPath ?? path + (Object.keys(query).length ? '?' + new URLSearchParams(query).toString() : ''),
    query
  } as any
}

describe('composables/useRouteGuard', () => {
  beforeEach(() => {
    mockCookieRef.value = null
    mockNavigateTo.mockClear()
  })

  describe('createRouteGuardHandler mode require', () => {
    const requireOptions = {
      cookieName: 'auth_token',
      mode: 'require' as const,
      skipPaths: ['/auth'],
      redirectTo: '/auth',
      redirectQueryKey: 'redirect'
    }

    it('redirects to redirectTo with redirect query when no token and path not in skipPaths', () => {
      mockCookieRef.value = null
      const handler = createRouteGuardHandler(requireOptions)
      const to = route('/dashboard', '/dashboard')
      handler(to, route('/'))

      expect(mockNavigateTo).toHaveBeenCalledTimes(1)
      expect(mockNavigateTo).toHaveBeenCalledWith('/auth?redirect=%2Fdashboard', { replace: true })
    })

    it('does not redirect when token exists', () => {
      mockCookieRef.value = 'token'
      const handler = createRouteGuardHandler(requireOptions)
      handler(route('/dashboard'), route('/'))
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('does not redirect when path is in skipPaths (public path)', () => {
      mockCookieRef.value = null
      const handler = createRouteGuardHandler(requireOptions)
      handler(route('/auth'), route('/'))
      handler(route('/auth/login'), route('/'))
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('redirects to redirectTo without query when fullPath is empty', () => {
      mockCookieRef.value = null
      const handler = createRouteGuardHandler(requireOptions)
      const to = route('/', '')
      to.fullPath = ''
      handler(to, route('/'))
      expect(mockNavigateTo).toHaveBeenCalledWith('/auth', { replace: true })
    })

    it('uses custom redirectQueryKey', () => {
      mockCookieRef.value = null
      const handler = createRouteGuardHandler({
        ...requireOptions,
        redirectQueryKey: 'return'
      })
      handler(route('/app', '/app'), route('/'))
      expect(mockNavigateTo).toHaveBeenCalledWith('/auth?return=%2Fapp', { replace: true })
    })
  })

  describe('createRouteGuardHandler mode guest', () => {
    const guestOptions = {
      cookieName: 'auth_token',
      mode: 'guest' as const,
      redirectTo: '/',
      redirectQueryKey: 'redirect'
    }

    it('redirects to redirectTo when token exists and no query.redirect', () => {
      mockCookieRef.value = 'token'
      const handler = createRouteGuardHandler(guestOptions)
      handler(route('/auth/login'), route('/'))
      expect(mockNavigateTo).toHaveBeenCalledWith('/', { replace: true })
    })

    it('redirects to query.redirect when token exists', () => {
      mockCookieRef.value = 'token'
      const handler = createRouteGuardHandler(guestOptions)
      handler(route('/auth/login', '/auth/login', { redirect: '/dashboard' }), route('/'))
      expect(mockNavigateTo).toHaveBeenCalledWith('/dashboard', { replace: true })
    })

    it('does not redirect when no token', () => {
      mockCookieRef.value = null
      const handler = createRouteGuardHandler(guestOptions)
      handler(route('/auth/login'), route('/'))
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('does not redirect when path is in skipPaths', () => {
      mockCookieRef.value = 'token'
      const handler = createRouteGuardHandler({
        ...guestOptions,
        skipPaths: ['/auth/public']
      })
      handler(route('/auth/public'), route('/'))
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })
  })

  describe('auth middleware options (contract)', () => {
    it('require handler with auth options redirects unauthenticated user from protected path to /auth', () => {
      mockCookieRef.value = null
      const handler = createRouteGuardHandler({
        cookieName: 'auth_token',
        mode: 'require',
        skipPaths: ['/auth'],
        redirectTo: '/auth',
        redirectQueryKey: 'redirect'
      })
      handler(route('/settings', '/settings'), route('/'))
      expect(mockNavigateTo).toHaveBeenCalledWith('/auth?redirect=%2Fsettings', { replace: true })
    })
  })

  describe('guest middleware options (contract)', () => {
    it('guest handler with guest options redirects authenticated user from /auth to /', () => {
      mockCookieRef.value = 'token'
      const handler = createRouteGuardHandler({
        cookieName: 'auth_token',
        mode: 'guest',
        redirectTo: '/',
        redirectQueryKey: 'redirect'
      })
      handler(route('/auth/login'), route('/'))
      expect(mockNavigateTo).toHaveBeenCalledWith('/', { replace: true })
    })
  })
})
