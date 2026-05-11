import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, h, defineComponent } from 'vue'
import {
  mantisNav,
  renderMantisDashboardContent,
  renderMantisLoginContent,
  renderMantisSignupContent,
  renderMantisDataTableContent,
  renderMantisCalendarContent,
  renderMantis404Content
} from '../dataTheme/mantis-theme'
// @ts-expect-error Vue SFC
import OrMantisSidebar from '../components/organisms/layout/mantis/OrMantisSidebar.vue'
// @ts-expect-error Vue SFC
import OrMantisNavbar from '../components/organisms/layout/mantis/OrMantisNavbar.vue'

function isActiveFn(_currentPath: string) {
  return (path: string) => path === '/workspace' || path.startsWith('/workspace')
}

const CONTAINER_CLASS = 'dashboard-theme-preview-container min-h-svh w-full'
const PREVIEW_MIN_WIDTH = 1280

function wrapWithScrollable(content: ReturnType<typeof h>) {
  return h('div', { class: 'overflow-x-auto w-full', style: 'min-height: 100vh' }, [
    h('div', { style: `min-width: ${PREVIEW_MIN_WIDTH}px` }, [content])
  ])
}

function renderWithSidebar(
  getOpen: () => boolean,
  setOpen: (v: boolean) => void,
  mainContent: ReturnType<typeof renderMantisDashboardContent>,
  title = 'Dashboard'
) {
  const layout = h('div', { class: CONTAINER_CLASS + ' min-h-svh bg-gray-100 dark:bg-gray-900' }, [
    h(OrMantisNavbar, { title, searchPlaceholder: 'Search...', onToggleSidebar: () => setOpen(true) }),
    h('div', { class: 'flex overflow-hidden pt-16' }, [
      h(OrMantisSidebar, {
        navigation: mantisNav,
        isActive: isActiveFn('/workspace'),
        open: getOpen(),
        'onUpdate:open': setOpen
      }),
      h('div', { class: 'h-full w-full flex-1 overflow-y-auto lg:ml-64' }, [
        h('main', { class: 'p-4 md:p-6' }, mainContent)
      ])
    ])
  ])
  return wrapWithScrollable(layout)
}

function renderFullPage(mainContent: ReturnType<typeof renderMantisDashboardContent>, backLabel?: string) {
  const backLink = backLabel
    ? h('a', { href: '/workspace', class: 'mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400' }, ['← ', backLabel])
    : null
  const layout = h('div', { class: CONTAINER_CLASS + ' min-h-svh bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6' }, [
    backLink,
    ...mainContent
  ])
  return wrapWithScrollable(layout)
}

const meta: Meta = {
  title: 'Dashboard Themes/Preview/Mantis Theme',
  parameters: { layout: 'fullscreen' }
}
export default meta

type Story = StoryObj

function withSidebar(name: string, getContent: () => ReturnType<typeof renderMantisDashboardContent>, title: string) {
  const Preview = defineComponent({
    name: `Mantis${name}Preview`,
    components: { OrMantisSidebar, OrMantisNavbar },
    setup() {
      const open = ref(true)
      return { getOpen: () => open.value, setOpen: (v: boolean) => { open.value = v } }
    },
    render() {
      return renderWithSidebar(this.getOpen, this.setOpen, getContent(), title)
    }
  })
  return { render: () => h(Preview) }
}

function fullPage(name: string, getContent: () => ReturnType<typeof renderMantisDashboardContent>, backLabel?: string) {
  const Preview = defineComponent({
    name: `Mantis${name}Preview`,
    render() {
      return renderFullPage(getContent(), backLabel)
    }
  })
  return { render: () => h(Preview) }
}

export const Dashboard: Story = withSidebar('Dashboard', renderMantisDashboardContent, 'Dashboard')
export const Login: Story = fullPage('Login', renderMantisLoginContent, 'Back to dashboard')
export const Signup: Story = fullPage('Signup', renderMantisSignupContent, 'Back to dashboard')
export const DataTable: Story = withSidebar('DataTable', renderMantisDataTableContent, 'Basic Tables')
export const Calendar: Story = withSidebar('Calendar', renderMantisCalendarContent, 'Calendar')
export const Page404: Story = fullPage('Page404', renderMantis404Content)
