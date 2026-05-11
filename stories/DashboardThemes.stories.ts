import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'

const themeIds = [
  'shadcn',
  'windster',
  'tailwind',
  'sneat',
  'spike',
  'material-shadcn',
  'notus',
  'mantis',
  'flyonui',
  'berry',
  'aurora',
  'flowbite'
]

const meta: Meta = {
  title: 'Documentation/Dashboard Themes',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Dashboard layout themes: chọn qua `NUXT_PUBLIC_DASHBOARD_THEME` trong `.env`. Xem preview: **Dashboard Themes → Preview** (mỗi theme có nhóm: Dashboard, Login, Signup, Data Table, Calendar, 404).'
      }
    }
  }
}
export default meta

type Story = StoryObj

export const ThemeList: Story = {
  render: () => ({
    setup: () => () =>
      h('div', { class: 'dashboard-themes-docs p-6 max-w-md space-y-2' }, [
        h('h2', { class: 'text-lg font-semibold mb-2' }, 'Theme IDs'),
        h('ul', { class: 'list-disc list-inside text-sm text-muted-foreground' }, themeIds.map((id) => h('li', { key: id }, id))),
        h('p', { class: 'text-sm mt-4' }, [
          'Preview: ',
          h('strong', null, 'Dashboard Themes → Preview'),
          ' — mỗi theme có nhóm: Dashboard, Login, Signup, Data Table, Calendar, 404.'
        ])
      ])
  })
}
