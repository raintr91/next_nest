/**
 * material-shadcn-theme: Material Shadcn dashboard theme.
 */
import type { VNode } from 'vue'
import { h } from 'vue'
import type { NavItem } from './default-theme'
import {
  LayoutDashboard,
  Calendar,
  User,
  FileText,
  Table,
  FileQuestion,
  PieChart,
  BarChart3,
  LogIn,
  UserPlus
} from 'lucide-vue-next'

export const materialShadcnNav: NavItem[] = [
  { name: 'Dashboard', path: '/workspace', icon: LayoutDashboard },
  { name: 'Calendar', path: '/workspace/calendar', icon: Calendar },
  { name: 'User Profile', path: '/workspace/profile', icon: User },
  { name: 'Form Elements', path: '/workspace/form-elements', icon: FileText },
  { name: 'Basic Tables', path: '/workspace/basic-tables', icon: Table },
  { name: 'Blank Page', path: '/workspace/blank', icon: FileQuestion },
  { name: '404 Page', path: '/workspace/error-404', icon: FileQuestion },
  { name: 'Sign In', path: '/auth/signin', icon: LogIn },
  { name: 'Sign Up', path: '/auth/signup', icon: UserPlus }
]

const MOCK_KPI = [
  { title: 'Total Revenue', value: '$45,231', change: '+20.1%', up: true },
  { title: 'Total Orders', value: '12,234', change: '+19%', up: true },
  { title: 'Active Now', value: '573', change: '+201', up: true }
]

export function renderMaterialShadcnDashboardContent(): VNode[] {
  return [
    h('div', { class: 'mb-6 flex items-center justify-between' }, [
      h('h1', { class: 'text-2xl font-bold text-gray-900 dark:text-white' }, 'Dashboard'),
      h('button', { class: 'rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600' }, 'Download')
    ]),
    h('div', { class: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6' }, MOCK_KPI.map((k) =>
      h('div', { key: k.title, class: 'rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800' }, [
        h('p', { class: 'text-sm font-medium text-gray-500 dark:text-gray-400' }, k.title),
        h('p', { class: 'mt-2 text-2xl font-bold text-gray-900 dark:text-white' }, k.value),
        h('p', { class: `mt-1 text-xs ${k.up ? 'text-green-600' : 'text-red-600'}` }, k.change + ' from last month')
      ])
    )),
    h('div', { class: 'rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800' }, [
      h('h2', { class: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Overview'),
      h('div', { class: 'h-64 flex items-center justify-center text-gray-400' }, 'Chart placeholder')
    ])
  ]
}

export function renderMaterialShadcnLoginContent(): VNode[] {
  return [
    h('div', { class: 'mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800' }, [
      h('h1', { class: 'mb-2 text-xl font-semibold text-gray-900 dark:text-white' }, 'Sign In'),
      h('p', { class: 'mb-4 text-sm text-gray-500 dark:text-gray-400' }, 'Enter your email and password to sign in.'),
      h('div', { class: 'space-y-4' }, [
        h('div', [
          h('label', { class: 'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300' }, 'Email'),
          h('input', { type: 'email', class: 'w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700', placeholder: 'you@example.com' })
        ]),
        h('div', [
          h('label', { class: 'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300' }, 'Password'),
          h('input', { type: 'password', class: 'w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700', placeholder: '••••••••' })
        ]),
        h('button', { class: 'w-full rounded-lg bg-violet-500 py-2 text-sm font-medium text-white hover:bg-violet-600' }, 'Sign In')
      ])
    ])
  ]
}

export function renderMaterialShadcnSignupContent(): VNode[] {
  return [
    h('div', { class: 'mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800' }, [
      h('h1', { class: 'mb-2 text-xl font-semibold text-gray-900 dark:text-white' }, 'Sign Up'),
      h('p', { class: 'mb-4 text-sm text-gray-500 dark:text-gray-400' }, 'Create your account.'),
      h('div', { class: 'space-y-4' }, [
        h('div', [
          h('label', { class: 'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300' }, 'Name'),
          h('input', { type: 'text', class: 'w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700', placeholder: 'Your name' })
        ]),
        h('div', [
          h('label', { class: 'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300' }, 'Email'),
          h('input', { type: 'email', class: 'w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700', placeholder: 'you@example.com' })
        ]),
        h('div', [
          h('label', { class: 'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300' }, 'Password'),
          h('input', { type: 'password', class: 'w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700', placeholder: '••••••••' })
        ]),
        h('button', { class: 'w-full rounded-lg bg-violet-500 py-2 text-sm font-medium text-white hover:bg-violet-600' }, 'Create account')
      ])
    ])
  ]
}

const MOCK_TABLE_ROWS = [
  { id: 1, name: 'Neil Sims', email: 'neil@example.com', role: 'Manager' },
  { id: 2, name: 'Bonnie Green', email: 'bonnie@example.com', role: 'User' }
]

export function renderMaterialShadcnDataTableContent(): VNode[] {
  return [
    h('div', { class: 'mb-4' }, [
      h('h1', { class: 'text-2xl font-bold text-gray-900 dark:text-white' }, 'Basic Tables'),
      h('p', { class: 'text-sm text-gray-500 dark:text-gray-400' }, 'Material Shadcn style table.')
    ]),
    h('div', { class: 'overflow-hidden rounded-xl border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800' }, [
      h('table', { class: 'min-w-full divide-y divide-gray-200 dark:divide-gray-600' }, [
        h('thead', { class: 'bg-gray-50 dark:bg-gray-700' }, [
          h('tr', [
            h('th', { class: 'px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300' }, 'Name'),
            h('th', { class: 'px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300' }, 'Email'),
            h('th', { class: 'px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300' }, 'Role')
          ])
        ]),
        h('tbody', { class: 'divide-y divide-gray-200 dark:divide-gray-600' },
          MOCK_TABLE_ROWS.map((row) =>
            h('tr', { key: row.id, class: 'hover:bg-gray-50 dark:hover:bg-gray-700' }, [
              h('td', { class: 'whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white' }, row.name),
              h('td', { class: 'whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400' }, row.email),
              h('td', { class: 'whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400' }, row.role)
            ])
          )
        )
      ])
    ])
  ]
}

export function renderMaterialShadcnCalendarContent(): VNode[] {
  return [
    h('h1', { class: 'mb-4 text-2xl font-bold text-gray-900 dark:text-white' }, 'Calendar'),
    h('div', { class: 'rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800' }, 'Calendar placeholder')
  ]
}

export function renderMaterialShadcn404Content(): VNode[] {
  return [
    h('div', { class: 'flex min-h-[50vh] flex-col items-center justify-center text-center' }, [
      h('h1', { class: 'text-6xl font-bold text-gray-900 dark:text-white' }, '404'),
      h('p', { class: 'mt-2 text-gray-500 dark:text-gray-400' }, 'Page not found.'),
      h('a', { href: '/workspace', class: 'mt-4 rounded-lg bg-violet-500 px-4 py-2 text-white hover:bg-violet-600' }, 'Back to Dashboard')
    ])
  ]
}
