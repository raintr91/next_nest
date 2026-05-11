import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, h, defineComponent } from 'vue'
import {
  flyonuiNav,
  renderFlyonuiDashboardContent,
  renderFlyonuiLoginContent,
  renderFlyonuiSignupContent,
  renderFlyonuiDataTableContent,
  renderFlyonuiCalendarContent,
  renderFlyonui404Content
} from '../dataTheme/flyonui-theme'
// @ts-expect-error Vue SFC
import OrFlyonuiSidebar from '../components/organisms/layout/flyonui/OrFlyonuiSidebar.vue'
// @ts-expect-error Vue SFC
import OrFlyonuiNavbar from '../components/organisms/layout/flyonui/OrFlyonuiNavbar.vue'

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
  mainContent: ReturnType<typeof renderFlyonuiDashboardContent>,
  title = 'Dashboard'
) {
  const layout = h('div', { class: CONTAINER_CLASS + ' min-h-svh bg-gray-100 dark:bg-gray-900' }, [
    h(OrFlyonuiNavbar, { title, searchPlaceholder: 'Search...', onToggleSidebar: () => setOpen(true) }),
    h('div', { class: 'flex overflow-hidden pt-16' }, [
      h(OrFlyonuiSidebar, {
        navigation: flyonuiNav,
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

function renderFullPage(mainContent: ReturnType<typeof renderFlyonuiDashboardContent>, backLabel?: string) {
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
  title: 'Dashboard Themes/Preview/Flyonui Theme',
  parameters: { layout: 'fullscreen' }
}
export default meta

type Story = StoryObj

function withSidebar(name: string, getContent: () => ReturnType<typeof renderFlyonuiDashboardContent>, title: string) {
  const Preview = defineComponent({
    name: `Flyonui${name}Preview`,
    components: { OrFlyonuiSidebar, OrFlyonuiNavbar },
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

function fullPage(name: string, getContent: () => ReturnType<typeof renderFlyonuiDashboardContent>, backLabel?: string) {
  const Preview = defineComponent({
    name: `Flyonui${name}Preview`,
    render() {
      return renderFullPage(getContent(), backLabel)
    }
  })
  return { render: () => h(Preview) }
}

export const Dashboard: Story = withSidebar('Dashboard', renderFlyonuiDashboardContent, 'Dashboard')
export const Login: Story = fullPage('Login', renderFlyonuiLoginContent, 'Back to dashboard')
export const Signup: Story = fullPage('Signup', renderFlyonuiSignupContent, 'Back to dashboard')
export const DataTable: Story = withSidebar('DataTable', renderFlyonuiDataTableContent, 'Basic Tables')
export const Calendar: Story = withSidebar('Calendar', renderFlyonuiCalendarContent, 'Calendar')
export const Page404: Story = fullPage('Page404', renderFlyonui404Content)
