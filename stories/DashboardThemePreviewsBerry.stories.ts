import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, h, defineComponent } from 'vue'
import {
  berryNav,
  renderBerryDashboardContent,
  renderBerryLoginContent,
  renderBerrySignupContent,
  renderBerryDataTableContent,
  renderBerryCalendarContent,
  renderBerry404Content
} from '../dataTheme/berry-theme'
// @ts-expect-error Vue SFC
import OrBerrySidebar from '../components/organisms/layout/berry/OrBerrySidebar.vue'
// @ts-expect-error Vue SFC
import OrBerryNavbar from '../components/organisms/layout/berry/OrBerryNavbar.vue'

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
  mainContent: ReturnType<typeof renderBerryDashboardContent>,
  title = 'Dashboard'
) {
  const layout = h('div', { class: CONTAINER_CLASS + ' min-h-svh bg-gray-100 dark:bg-gray-900' }, [
    h(OrBerryNavbar, { title, searchPlaceholder: 'Search...', onToggleSidebar: () => setOpen(true) }),
    h('div', { class: 'flex overflow-hidden pt-16' }, [
      h(OrBerrySidebar, {
        navigation: berryNav,
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

function renderFullPage(mainContent: ReturnType<typeof renderBerryDashboardContent>, backLabel?: string) {
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
  title: 'Dashboard Themes/Preview/Berry Theme',
  parameters: { layout: 'fullscreen' }
}
export default meta

type Story = StoryObj

function withSidebar(name: string, getContent: () => ReturnType<typeof renderBerryDashboardContent>, title: string) {
  const Preview = defineComponent({
    name: `Berry${name}Preview`,
    components: { OrBerrySidebar, OrBerryNavbar },
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

function fullPage(name: string, getContent: () => ReturnType<typeof renderBerryDashboardContent>, backLabel?: string) {
  const Preview = defineComponent({
    name: `Berry${name}Preview`,
    render() {
      return renderFullPage(getContent(), backLabel)
    }
  })
  return { render: () => h(Preview) }
}

export const Dashboard: Story = withSidebar('Dashboard', renderBerryDashboardContent, 'Dashboard')
export const Login: Story = fullPage('Login', renderBerryLoginContent, 'Back to dashboard')
export const Signup: Story = fullPage('Signup', renderBerrySignupContent, 'Back to dashboard')
export const DataTable: Story = withSidebar('DataTable', renderBerryDataTableContent, 'Basic Tables')
export const Calendar: Story = withSidebar('Calendar', renderBerryCalendarContent, 'Calendar')
export const Page404: Story = fullPage('Page404', renderBerry404Content)
