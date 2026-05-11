import { createRouteGuardHandler } from '~/composables/useRouteGuard'

/**
 * Guest-only: redirect to redirectTo (or query.redirect) when user is already logged in.
 * Use on auth pages (login, register) so logged-in users are sent to app/dashboard.
 */
export default defineNuxtRouteMiddleware(
  createRouteGuardHandler({
    cookieName: 'auth_token',
    mode: 'guest',
    redirectTo: '/',
    redirectQueryKey: 'redirect'
  })
)
