/**
 * shadcn-theme: nav, mock data và render dashboard content.
 * Tham khảo: shadcn-vue sidebar, layout collapsible, dashboard Overview + Recent Sales.
 */
import type { VNode } from 'vue'
import { h } from 'vue'
import type { NavItem } from './default-theme'
import {
  LayoutDashboard,
  ListTodo,
  Package,
  MessageSquare,
  Users,
  UserCog,
  Settings,
  Palette,
  Bell,
  Monitor,
  HelpCircle
} from 'lucide-vue-next'

export const shadcnNav: NavItem[] = [
  { name: 'Dashboard', path: '/workspace', icon: LayoutDashboard },
  { name: 'Tasks', path: '/workspace/tasks', icon: ListTodo },
  { name: 'Apps', path: '/workspace/apps', icon: Package },
  { name: 'Chats', path: '/workspace/chats', icon: MessageSquare },
  { name: 'Users', path: '/workspace/users', icon: Users },
  { name: 'Profile', path: '/workspace/settings', icon: UserCog },
  { name: 'Account', path: '/workspace/settings/account', icon: Settings },
  { name: 'Appearance', path: '/workspace/settings/appearance', icon: Palette },
  { name: 'Notifications', path: '/workspace/settings/notifications', icon: Bell },
  { name: 'Display', path: '/workspace/settings/display', icon: Monitor },
  { name: 'Help Center', path: '/workspace/help-center', icon: HelpCircle }
]

/** Mock data theo shadcn-vue dashboard */
export const MOCK_SHADCN_STATS = [
  { title: 'Total Revenue', value: '$45,231.89', desc: '+20.1% from last month' },
  { title: 'Subscriptions', value: '+2350', desc: '+180.1% from last month' },
  { title: 'Sales', value: '+12,234', desc: '+19% from last month' },
  { title: 'Active Now', value: '+573', desc: '+201 since last hour' }
]

export const MOCK_SHADCN_RECENT_SALES = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00' },
  { name: 'William Kim', email: 'will@email.com', amount: '+$99.00' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00' }
]

/** SVG bar chart placeholder (Jan–Dec) giống shadcn-vue Overview */
function renderShadcnOverviewChart(): VNode {
  const w = 560
  const chartH = 280
  const values = [2400, 1398, 3800, 3908, 4800, 3800, 4300, 3200, 2800, 3890, 4398, 5100]
  const max = Math.max(...values)
  const barW = (w - 80) / values.length - 4
  return h('div', { class: 'w-full', style: 'min-height: 280px' }, [
    h('svg', { viewBox: `0 0 ${w} ${chartH}`, class: 'w-full h-[280px]', preserveAspectRatio: 'xMidYMid meet' }, [
      ...values.map((v, i) => {
        const x = 40 + i * ((w - 80) / values.length)
        const barH = ((v / max) * (chartH - 60))
        return h('rect', {
          key: i,
          x,
          y: chartH - 40 - barH,
          width: barW,
          height: barH,
          rx: 4,
          class: 'fill-primary'
        })
      }),
      h('text', { x: 40, y: 20, class: 'text-xs fill-muted-foreground' }, '$5k'),
      h('text', { x: 40, y: chartH - 25, class: 'text-xs fill-muted-foreground' }, '$0'),
      ...['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((label, i) =>
        h('text', { key: label, x: 44 + i * ((w - 80) / 12), y: chartH - 8, class: 'text-xs fill-muted-foreground' }, label)
      )
    ])
  ])
}

/** Dashboard content shadcn-vue: 4 KPI + Overview chart + Recent Sales (cấu trúc giống Windster) */
export function renderShadcnDashboardContent(): VNode[] {
  return [
    h('div', { class: 'mb-6 flex items-center justify-between' }, [
      h('h1', { class: 'text-2xl font-bold tracking-tight' }, 'Dashboard'),
      h('button', { class: 'inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-9 px-4' }, 'Download')
    ]),
    h('div', { class: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6' }, MOCK_SHADCN_STATS.map((stat) =>
      h('Card', null, {
        default: () => [
          h('CardHeader', { class: 'flex flex-row items-center justify-between pb-2' }, {
            default: () => [h('CardTitle', { class: 'text-sm font-medium text-muted-foreground' }, stat.title)]
          }),
          h('CardContent', null, {
            default: () => [
              h('div', { class: 'text-2xl font-bold' }, stat.value),
              h('p', { class: 'text-xs text-muted-foreground' }, stat.desc)
            ]
          })
        ]
      })
    )),
    h('div', { class: 'grid gap-4 lg:grid-cols-7' }, [
      h('Card', { class: 'lg:col-span-4' }, {
        default: () => [
          h('CardHeader', null, { default: () => [h('CardTitle', null, 'Overview')] }),
          h('CardContent', { class: 'ps-2' }, {
            default: () => [renderShadcnOverviewChart()]
          })
        ]
      }),
      h('Card', { class: 'lg:col-span-3' }, {
        default: () => [
          h('CardHeader', null, {
            default: () => [
              h('CardTitle', null, 'Recent Sales'),
              h('CardDescription', null, 'You made 265 sales this month.')
            ]
          }),
          h('CardContent', null, {
            default: () =>
              h('div', { class: 'space-y-6' }, MOCK_SHADCN_RECENT_SALES.map((sale) =>
                h('div', { class: 'flex items-center gap-4', key: sale.email }, [
                  h('div', { class: 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium' }, sale.name.slice(0, 2).toUpperCase()),
                  h('div', { class: 'flex-1 min-w-0 space-y-1' }, [
                    h('p', { class: 'text-sm font-medium leading-none' }, sale.name),
                    h('p', { class: 'text-sm text-muted-foreground truncate' }, sale.email)
                  ]),
                  h('div', { class: 'font-medium' }, sale.amount)
                ])
              ))
          })
        ]
      })
    ])
  ]
}
