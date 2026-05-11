import { createRouteGuardHandler } from '~/composables/useRouteGuard'

export default defineNuxtRouteMiddleware(
  createRouteGuardHandler({
    cookieName: 'auth_token',
    mode: 'require',
    skipPaths: ['/auth', '/password/reset', '/404', '/forbidden'],
    redirectTo: '/auth/login',
    redirectQueryKey: 'redirect'
  })
)
