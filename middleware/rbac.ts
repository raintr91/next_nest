import type { Role } from '~/models/user/user.types'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()

  const requiredRoles = (to.meta?.roles ?? []) as Role[]
  if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) return

  if (!auth.isAuthenticated) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  }

  if (!auth.user) {
    try {
      await auth.fetchMe()
    } catch {
      auth.logout()
      return navigateTo({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
    }
  }

  const role = auth.user?.role
  if (!role || !requiredRoles.includes(role)) {
    return navigateTo('/forbidden')
  }
})
