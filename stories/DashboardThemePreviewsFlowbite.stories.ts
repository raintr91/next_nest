import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, h, defineComponent } from 'vue'
import {
  flowbiteNav,
  renderFlowbiteDashboardContent,
  renderFlowbiteLoginContent,
  renderFlowbiteSignupContent,
  renderFlowbiteDataTableContent,
  renderFlowbiteCalendarContent,
  renderFlowbite404Content,
  renderFlowbiteSettingsContent,
  renderFlowbitePricingContent,
  renderFlowbiteMaintenanceContent,
  renderFlowbite500Content
} from '../dataTheme/flowbite-theme'
// @ts-expect-error Vue SFC
import OrFlowbiteSidebar from '../components/organisms/layout/flowbite/OrFlowbiteSidebar.vue'
// @ts-expect-error Vue SFC
import OrFlowbiteNavbar from '../components/organisms/layout/flowbite/OrFlowbiteNavbar.vue'

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
  mainContent: ReturnType<typeof renderFlowbiteDashboardContent>,
  title = 'Dashboard'
) {
  const layout = h('div', { class: CONTAINER_CLASS + ' min-h-svh bg-gray-50 dark:bg-gray-900' }, [
    h(OrFlowbiteNavbar, { title, searchPlaceholder: 'Search', onToggleSidebar: () => setOpen(true) }),
    h('div', { class: 'flex overflow-hidden pt-16' }, [
      h(OrFlowbiteSidebar, {
        navigation: flowbiteNav,
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

function renderFullPage(mainContent: ReturnType<typeof renderFlowbiteDashboardContent>, backLabel?: string) {
  const backLink = backLabel
    ? h('a', { href: '/workspace', class: 'mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400' }, ['← ', backLabel])
    : null
  const layout = h('div', { class: CONTAINER_CLASS + ' min-h-svh bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6' }, [
    backLink,
    ...mainContent
  ])
  return wrapWithScrollable(layout)
}

const meta: Meta = {
  title: 'Dashboard Themes/Preview/Flowbite Theme',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Flowbite theme: light/dark mode, các page phụ (Settings, Pricing, Maintenance, 404, 500).'
      }
    }
  }
}
export default meta

type Story = StoryObj

function withSidebar(name: string, getContent: () => ReturnType<typeof renderFlowbiteDashboardContent>, title: string) {
  const Preview = defineComponent({
    name: `Flowbite${name}Preview`,
    components: { OrFlowbiteSidebar, OrFlowbiteNavbar },
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

function fullPage(name: string, getContent: () => ReturnType<typeof renderFlowbiteDashboardContent>, backLabel?: string) {
  const Preview = defineComponent({
    name: `Flowbite${name}Preview`,
    render() {
      return renderFullPage(getContent(), backLabel)
    }
  })
  return { render: () => h(Preview) }
}

export const Dashboard: Story = withSidebar('Dashboard', renderFlowbiteDashboardContent, 'Dashboard')
export const Login: Story = fullPage('Login', renderFlowbiteLoginContent, 'Back to dashboard')
export const Signup: Story = fullPage('Signup', renderFlowbiteSignupContent, 'Back to dashboard')
export const DataTable: Story = withSidebar('DataTable', renderFlowbiteDataTableContent, 'Tables')
export const Calendar: Story = withSidebar('Calendar', renderFlowbiteCalendarContent, 'Calendar')
export const Page404: Story = fullPage('Page404', renderFlowbite404Content)
export const Settings: Story = withSidebar('Settings', renderFlowbiteSettingsContent, 'Settings')
export const Pricing: Story = withSidebar('Pricing', renderFlowbitePricingContent, 'Pricing')
export const Maintenance: Story = fullPage('Maintenance', renderFlowbiteMaintenanceContent)
export const Page500: Story = fullPage('Page500', renderFlowbite500Content, 'Back to dashboard')
