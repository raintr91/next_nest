import type { Component } from 'vue'
import { LayoutDashboard, Users, Settings } from 'lucide-vue-next'

export interface NavItem {
  name: string
  path: string
  icon: Component
}

/** Menu mặc định (dùng khi cần nav đơn giản, ví dụ story) */
export const defaultNav: NavItem[] = [
  { name: 'Dashboard', path: '/workspace', icon: LayoutDashboard },
  { name: 'Robots', path: '/workspace/robots', icon: Users },
  { name: 'Settings', path: '/workspace/settings', icon: Settings }
]
