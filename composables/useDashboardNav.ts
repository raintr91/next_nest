import type { Component } from 'vue'
import { LayoutDashboard } from 'lucide-vue-next'

export interface DashboardNavItem {
  name: string
  path: string
  icon: Component
  children?: DashboardNavItem[]
}

/** Default sidebar nav for auth-first portal (minimal). Pass customNav to override in theme layouts. */
export function useDashboardNav(customNav?: DashboardNavItem[]) {
  if (customNav) return customNav

  return [
    { name: 'ホーム', path: '/', icon: LayoutDashboard }
  ] satisfies DashboardNavItem[]
}
