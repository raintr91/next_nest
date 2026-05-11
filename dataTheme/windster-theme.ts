import type { VNode } from 'vue'
import { h } from 'vue'
import type { NavItem } from './default-theme'
import {
  LayoutDashboard,
  LayoutGrid,
  Inbox,
  Users,
  ShoppingCart,
  LogIn,
  UserPlus
} from 'lucide-vue-next'

export const windsterNav: NavItem[] = [
  { name: 'Dashboard', path: '/workspace', icon: LayoutDashboard },
  { name: 'Kanban', path: '/workspace/kanban', icon: LayoutGrid },
  { name: 'Inbox', path: '/workspace/inbox', icon: Inbox },
  { name: 'Users', path: '/workspace/users', icon: Users },
  { name: 'Products', path: '/workspace/products', icon: ShoppingCart },
  { name: 'Sign In', path: '/auth/sign-in', icon: LogIn },
  { name: 'Sign Up', path: '/auth/sign-up', icon: UserPlus }
]

export const MOCK_WINDSTER_TRANSACTIONS = [
  { label: 'Payment from', name: 'Bonnie Green', date: 'Apr 23, 2021', amount: '$2300' },
  { label: 'Payment refund to', name: '#00910', date: 'Apr 23, 2021', amount: '-$670' },
  { label: 'Payment failed from', name: '#087651', date: 'Apr 18, 2021', amount: '$234' },
  { label: 'Payment from', name: 'Lana Byrd', date: 'Apr 15, 2021', amount: '$5000' },
  { label: 'Payment from', name: 'Jese Leos', date: 'Apr 15, 2021', amount: '$2300' },
  { label: 'Payment from', name: 'THEMESBERG LLC', date: 'Apr 11, 2021', amount: '$560' },
  { label: 'Payment from', name: 'Lana Lysle', date: 'Apr 6, 2021', amount: '$1437' }
]

export const MOCK_WINDSTER_KPI_CARDS = [
  { value: '2,340', desc: 'New products this week', change: '14.6%', up: true },
  { value: '5,355', desc: 'Visitors this week', change: '32.9%', up: true },
  { value: '385', desc: 'User signups this week', change: '2.7%', up: false }
]

export const MOCK_WINDSTER_CUSTOMERS = [
  { name: 'Neil Sims', email: 'email@windster.com', amount: '$320' },
  { name: 'Bonnie Green', email: 'email@windster.com', amount: '$3467' },
  { name: 'Michael Gough', email: 'email@windster.com', amount: '$67' },
  { name: 'Thomes Lean', email: 'email@windster.com', amount: '$2367' },
  { name: 'Lana Byrd', email: 'email@windster.com', amount: '$367' }
]

export const MOCK_WINDSTER_ACQUISITION = [
  { channel: 'Organic Search', users: '5,649', pct: 30, barClass: 'bg-cyan-600' },
  { channel: 'Referral', users: '4,025', pct: 24, barClass: 'bg-orange-300' },
  { channel: 'Direct', users: '3,105', pct: 18, barClass: 'bg-teal-400' },
  { channel: 'Social', users: '1251', pct: 12, barClass: 'bg-pink-600' },
  { channel: 'Other', users: '734', pct: 9, barClass: 'bg-indigo-600' },
  { channel: 'Email', users: '456', pct: 7, barClass: 'bg-purple-500' }
]

const ARROW_UP = 'M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z'
const ARROW_DOWN = 'M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z'

const WINDSTER_CHART_COLOR = '#0694a2'

/** Tạo path SVG smooth (cubic Bezier) qua các điểm – nét mềm như ApexCharts */
function smoothPathD(
  pts: { x: number; y: number }[],
  baseY: number
): { area: string; line: string } {
  if (pts.length < 2) return { area: '', line: '' }
  const n = pts.length
  const p0 = pts[0]!
  let lineD = `M ${p0.x} ${p0.y}`
  for (let i = 0; i < n - 1; i++) {
    const p0_ = pts[Math.max(0, i - 1)]!
    const p1 = pts[i]!
    const p2 = pts[i + 1]!
    const p3 = pts[Math.min(n - 1, i + 2)]!
    const cp1x = p1.x + (p2.x - p0_.x) / 6
    const cp1y = p1.y + (p2.y - p0_.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    lineD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  const last = pts[n - 1]!
  const areaD = lineD + ` L ${last.x} ${baseY} L ${p0.x} ${baseY} Z`
  return { area: areaD, line: lineD }
}

/** Area chart nét mềm (smooth curve), màu #0694a2, data theo charts.js */
function renderWindsterSalesChart(): VNode {
  const w = 640
  const chartH = 320
  const values = [6356, 6218, 6156, 6526, 6356, 6256, 6056]
  const min = 6056
  const max = 6526
  const baseY = chartH - 50
  const pts = values.map((v, i) => ({
    x: (i / (values.length - 1)) * (w - 80) + 40,
    y: chartH - 50 - ((v - min) / (max - min)) * (chartH - 100)
  }))
  const { area: areaD, line: lineD } = smoothPathD(pts, baseY)
  return h('div', { class: 'w-full', style: 'min-height: 320px' }, [
    h('svg', { viewBox: `0 0 ${w} ${chartH}`, class: 'w-full h-[320px]', preserveAspectRatio: 'xMidYMid meet' }, [
      h('path', { d: areaD, fill: WINDSTER_CHART_COLOR, stroke: 'none', opacity: 0.3 }),
      h('path', { d: lineD, fill: 'none', stroke: WINDSTER_CHART_COLOR, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      ...pts.map((p, i) => h('circle', { key: i, cx: p.x, cy: p.y, r: 4, fill: WINDSTER_CHART_COLOR })),
      h('text', { x: 40, y: 35, fill: '#6B7280', style: 'font-size: 14px' }, '$6526'),
      h('text', { x: 40, y: chartH - 55, fill: '#6B7280', style: 'font-size: 14px' }, '$6056'),
      ...['01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb', '06 Feb', '07 Feb'].map((label, i) =>
        h('text', { key: label, x: (pts[i]?.x ?? 0) - 18, y: chartH - 18, fill: '#6B7280', style: 'font-size: 14px' }, label)
      )
    ])
  ])
}

/** Block 1: Sales chart – đúng cấu trúc HTML Windster (div riêng) */
function renderSalesBlock(): VNode {
  return h('div', { class: 'bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 2xl:col-span-2' }, [
    h('div', { class: 'flex items-center justify-between mb-4' }, [
      h('div', { class: 'flex-shrink-0' }, [
        h('span', { class: 'text-2xl sm:text-3xl leading-none font-bold text-gray-900' }, '$45,385'),
        h('h3', { class: 'text-base font-normal text-gray-500' }, 'Sales this week')
      ]),
      h('div', { class: 'flex items-center justify-end flex-1 text-green-500 text-base font-bold' }, [
        '12.5% ',
        h('svg', { class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [h('path', { fillRule: 'evenodd', d: ARROW_UP, clipRule: 'evenodd' })])
      ])
    ]),
    renderWindsterSalesChart()
  ])
}

/** Block 2: Latest Transactions – table thuần như HTML */
function renderTransactionsBlock(): VNode {
  return h('div', { class: 'bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8' }, [
    h('div', { class: 'mb-4 flex items-center justify-between' }, [
      h('div', null, [
        h('h3', { class: 'text-xl font-bold text-gray-900 mb-2' }, 'Latest Transactions'),
        h('span', { class: 'text-base font-normal text-gray-500' }, 'This is a list of latest transactions')
      ]),
      h('a', { href: '#', class: 'text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2' }, 'View all')
    ]),
    h('div', { class: 'flex flex-col mt-8' }, [
      h('div', { class: 'overflow-x-auto rounded-lg' }, [
        h('div', { class: 'align-middle inline-block min-w-full' }, [
          h('div', { class: 'shadow overflow-hidden sm:rounded-lg' }, [
            h('table', { class: 'min-w-full divide-y divide-gray-200' }, [
              h('thead', { class: 'bg-gray-50' }, [
                h('tr', null, [
                  h('th', { scope: 'col', class: 'p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Transaction'),
                  h('th', { scope: 'col', class: 'p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Date & Time'),
                  h('th', { scope: 'col', class: 'p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Amount')
                ])
              ]),
              h('tbody', { class: 'bg-white' }, MOCK_WINDSTER_TRANSACTIONS.map((row, i) =>
                h('tr', { key: i, class: i % 2 === 1 ? 'bg-gray-50' : '' }, [
                  h('td', { class: 'p-4 whitespace-nowrap text-sm font-normal text-gray-900' }, [h('span', null, row.label + ' '), h('span', { class: 'font-semibold' }, row.name)]),
                  h('td', { class: 'p-4 whitespace-nowrap text-sm font-normal text-gray-500' }, row.date),
                  h('td', { class: 'p-4 whitespace-nowrap text-sm font-semibold text-gray-900' }, row.amount)
                ])
              ))
            ])
          ])
        ])
      ])
    ])
  ])
}

/** Block 3: từng KPI card – mỗi ô một div block riêng */
function renderKpiBlocks(): VNode[] {
  return MOCK_WINDSTER_KPI_CARDS.map((card) =>
    h('div', { key: card.desc, class: 'bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8' }, [
      h('div', { class: 'flex items-center' }, [
        h('div', { class: 'flex-shrink-0' }, [
          h('span', { class: 'text-2xl sm:text-3xl leading-none font-bold text-gray-900' }, card.value),
          h('h3', { class: 'text-base font-normal text-gray-500' }, card.desc)
        ]),
        h('div', { class: `ml-5 w-0 flex items-center justify-end flex-1 text-base font-bold ${card.up ? 'text-green-500' : 'text-red-500'}` }, [
          (card.up ? '' : '-') + card.change,
          h('svg', { class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [
            h('path', { fillRule: 'evenodd', clipRule: 'evenodd', d: card.up ? ARROW_UP : ARROW_DOWN })
          ])
        ])
      ])
    ])
  )
}

/** Block 4: Latest Customers – list thuần */
function renderLatestCustomersBlock(): VNode {
  return h('div', { class: 'bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full' }, [
    h('div', { class: 'flex items-center justify-between mb-4' }, [
      h('h3', { class: 'text-xl font-bold leading-none text-gray-900' }, 'Latest Customers'),
      h('a', { href: '#', class: 'text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg inline-flex p-2' }, 'View all')
    ]),
    h('div', { class: 'flow-root' }, [
      h('ul', { role: 'list', class: 'divide-y divide-gray-200' }, MOCK_WINDSTER_CUSTOMERS.map((c, i) =>
        h('li', { key: i, class: 'py-3 sm:py-4' }, [
          h('div', { class: 'flex items-center space-x-4' }, [
            h('div', { class: 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium' }, c.name.slice(0, 2)),
            h('div', { class: 'flex-1 min-w-0' }, [
              h('p', { class: 'text-sm font-medium text-gray-900 truncate' }, c.name),
              h('p', { class: 'text-sm text-gray-500 truncate' }, c.email)
            ]),
            h('div', { class: 'inline-flex items-center text-base font-semibold text-gray-900' }, c.amount)
          ])
        ])
      ))
    ])
  ])
}

/** Block 5: Acquisition Overview – table thuần + progress bar màu */
function renderAcquisitionBlock(): VNode {
  return h('div', { class: 'bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8' }, [
    h('h3', { class: 'text-xl leading-none font-bold text-gray-900 mb-10' }, 'Acquisition Overview'),
    h('div', { class: 'block w-full overflow-x-auto' }, [
      h('table', { class: 'items-center w-full bg-transparent border-collapse' }, [
        h('thead', null, [
          h('tr', null, [
            h('th', { class: 'px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap' }, 'Top Channels'),
            h('th', { class: 'px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap' }, 'Users'),
            h('th', { class: 'px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap min-w-[140px]' }, '')
          ])
        ]),
        h('tbody', { class: 'divide-y divide-gray-100' }, MOCK_WINDSTER_ACQUISITION.map((row, i) =>
          h('tr', { key: i, class: 'text-gray-500' }, [
            h('th', { class: 'border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left' }, row.channel),
            h('td', { class: 'border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4' }, row.users),
            h('td', { class: 'border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4' }, [
              h('div', { class: 'flex items-center' }, [
                h('span', { class: 'mr-2 text-xs font-medium' }, row.pct + '%'),
                h('div', { class: 'relative w-full' }, [
                  h('div', { class: 'w-full bg-gray-200 rounded-sm h-2' }, [
                    h('div', { class: 'h-2 rounded-sm ' + row.barClass, style: { width: row.pct + '%' } })
                  ])
                ])
              ])
            ])
          ])
        ))
      ])
    ])
  ])
}

/** Footer – block riêng */
function renderFooterBlock(): VNode {
  return h('footer', { class: 'bg-white md:flex md:items-center md:justify-between shadow rounded-lg p-4 md:p-6 xl:p-8 my-6 mx-0' }, [
    h('ul', { class: 'flex items-center flex-wrap mb-6 md:mb-0' }, [
      h('li', null, [h('a', { href: '#!', class: 'text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6' }, 'Terms and conditions')]),
      h('li', null, [h('a', { href: '#!', class: 'text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6' }, 'Privacy Policy')]),
      h('li', null, [h('a', { href: '#!', class: 'text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6' }, 'Licensing')]),
      h('li', null, [h('a', { href: '#!', class: 'text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6' }, 'Cookie Policy')]),
      h('li', null, [h('a', { href: '#!', class: 'text-sm font-normal text-gray-500 hover:underline' }, 'Contact')])
    ]),
    h('p', { class: 'text-center text-sm text-gray-500 my-10' }, [
      '© 2019-2025 ',
      h('a', { href: 'https://themesberg.com', class: 'hover:underline', target: '_blank', rel: 'noopener' }, 'Themesberg'),
      '. All rights reserved. Distributed by ',
      h('a', { href: 'https://themewagon.com', class: 'hover:underline', target: '_blank', rel: 'noopener' }, 'ThemeWagon'),
      '.'
    ])
  ])
}

/** Dashboard: từng block riêng (div + table thuần), chart nét mềm */
export function renderWindsterDashboardContent(): VNode[] {
  return [
    h('div', { class: 'w-full grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4' }, [
      renderSalesBlock(),
      renderTransactionsBlock()
    ]),
    h('div', { class: 'mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' }, renderKpiBlocks()),
    h('div', { class: 'grid grid-cols-1 2xl:grid-cols-2 xl:gap-4 my-4' }, [
      renderLatestCustomersBlock(),
      renderAcquisitionBlock()
    ]),
    renderFooterBlock()
  ]
}
