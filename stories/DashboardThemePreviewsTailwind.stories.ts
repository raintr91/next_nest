import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, h, defineComponent } from 'vue'
import {
  tailwindNav,
  renderTailwindDashboardContent,
  renderTailwindLoginContent,
  renderTailwindSignupContent,
  renderTailwindDataTableContent,
  renderTailwindCalendarContent,
  renderTailwind404Content
} from '../dataTheme/tailwind-theme'
// @ts-expect-error Vue SFC
import OrTailwindSidebar from '../components/organisms/layout/tailwind/OrTailwindSidebar.vue'
// @ts-expect-error Vue SFC
import OrTailwindNavbar from '../components/organisms/layout/tailwind/OrTailwindNavbar.vue'

function isActiveFn(currentPath: string) {
  return (path: string) =>
    currentPath === path || (path !== '/workspace' && currentPath.startsWith(path))
}

const CONTAINER_CLASS = 'dashboard-theme-preview-container min-h-svh w-full'
const PREVIEW_MIN_WIDTH = 1280

function wrapWithScrollable(content: ReturnType<typeof h>) {
  return h('div', { class: 'overflow-x-auto w-full', style: 'min-height: 100vh' }, [
    h('div', { style: `min-width: ${PREVIEW_MIN_WIDTH}px` }, [content])
  ])
}

/** Layout có sidebar + navbar (Dashboard, Data Table, Calendar) */
function renderTailwindWithSidebar(
  getOpen: () => boolean,
  setOpen: (v: boolean) => void,
  mainContent: ReturnType<typeof h>[],
  title = 'Dashboard'
) {
  const layout = h('div', { class: CONTAINER_CLASS + ' min-h-svh bg-gray-50 dark:bg-gray-950' }, [
    h(OrTailwindNavbar, {
      title,
      searchPlaceholder: 'Search...',
      onToggleSidebar: () => setOpen(true)
    }),
    h('div', { class: 'flex overflow-hidden pt-16' }, [
      h(OrTailwindSidebar, {
        navigation: tailwindNav,
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

/** Full-page không sidebar, không navbar (Login, Signup, 404) */
function renderTailwindFullPage(mainContent: ReturnType<typeof h>[], backLabel?: string) {
  const backLink = backLabel
    ? h('a', { href: '/workspace', class: 'mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300' }, [
        h('span', { class: 'mr-1' }, '←'),
        backLabel
      ])
    : null
  const layout = h('div', { class: CONTAINER_CLASS + ' min-h-svh bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6' }, [
    backLink,
    ...mainContent
  ])
  return wrapWithScrollable(layout)
}

const meta: Meta = {
  title: 'Dashboard Themes/Preview/Tailwind Theme',
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'desktop1',
      viewports: {
        desktop1: {
          name: 'Desktop (1280)',
          styles: { width: '1280px', height: '800px' },
          type: 'desktop'
        }
      }
    },
    docs: {
      description: {
        component: 'Tailwind theme (Tailwind UI kit): Dashboard, Login, Signup, Data Table, Calendar, 404.'
      }
    }
  }
}
export default meta

type Story = StoryObj

/** Story có sidebar (Dashboard, Data Table, Calendar) */
function makeTailwindWithSidebar(
  name: string,
  getContent: () => ReturnType<typeof renderTailwindDashboardContent>,
  title: string
) {
  const Preview = defineComponent({
    name: `TailwindTheme${name}Preview`,
    components: { OrTailwindSidebar, OrTailwindNavbar },
    setup() {
      const open = ref(true)
      return { getOpen: () => open.value, setOpen: (v: boolean) => { open.value = v } }
    },
    render() {
      return renderTailwindWithSidebar(this.getOpen, this.setOpen, getContent(), title)
    }
  })
  return { render: () => h(Preview) }
}

/** Story full-page không sidebar (Login, Signup, 404) */
function makeTailwindFullPage(
  name: string,
  getContent: () => ReturnType<typeof renderTailwindDashboardContent>,
  backLabel?: string
) {
  const Preview = defineComponent({
    name: `TailwindTheme${name}Preview`,
    render() {
      return renderTailwindFullPage(getContent(), backLabel)
    }
  })
  return { render: () => h(Preview) }
}

export const Dashboard: Story = makeTailwindWithSidebar('Dashboard', renderTailwindDashboardContent, 'Dashboard')
export const Login: Story = makeTailwindFullPage('Login', renderTailwindLoginContent, 'Back to dashboard')
export const Signup: Story = makeTailwindFullPage('Signup', renderTailwindSignupContent, 'Back to dashboard')
export const DataTable: Story = makeTailwindWithSidebar('DataTable', renderTailwindDataTableContent, 'Basic Tables')
export const Calendar: Story = makeTailwindWithSidebar('Calendar', renderTailwindCalendarContent, 'Calendar')
export const Page404: Story = makeTailwindFullPage('Page404', renderTailwind404Content)
