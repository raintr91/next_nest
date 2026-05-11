import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, h, defineComponent } from 'vue'
import { windsterNav, renderWindsterDashboardContent } from '../dataTheme/windster-theme'
import { shadcnNav, renderShadcnDashboardContent } from '../dataTheme/shadcn-theme'
// @ts-expect-error Vue SFC
import OrWindsterSidebar from '../components/organisms/layout/windster/OrWindsterSidebar.vue'
// @ts-expect-error Vue SFC
import OrWindsterNavbar from '../components/organisms/layout/windster/OrWindsterNavbar.vue'
// @ts-expect-error Vue SFC
import OrShadcnSidebar from '../components/organisms/layout/OrShadcnSidebar.vue'
// @ts-expect-error Vue SFC
import OrShadcnNavbar from '../components/organisms/layout/OrShadcnNavbar.vue'
// @ts-expect-error Vue SFC
import AtSidebarProvider from '../components/atoms/sidebar/SidebarProvider.vue'
// @ts-expect-error Vue SFC
import AtSidebarInset from '../components/atoms/sidebar/SidebarInset.vue'
import { SIDEBAR_WIDTH } from '../components/atoms/sidebar/utils'

function isActiveFn(currentPath: string) {
  return (path: string) =>
    currentPath === path || (path !== '/workspace' && currentPath.startsWith(path))
}

const noop = () => {}

const meta: Meta = {
  title: 'Dashboard Themes/Preview',
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
        component: 'Xem trước theme layout: Shadcn Theme, Windster Theme. Tailwind Theme có nhóm riêng: Dashboard Themes → Preview → Tailwind Theme.'
      }
    }
  }
}
export default meta

type Story = StoryObj

const CONTAINER_CLASS = 'dashboard-theme-preview-container min-h-svh w-full'
const PREVIEW_MIN_WIDTH = 1280

function wrapWithScrollable(content: ReturnType<typeof h>) {
  return h('div', { class: 'overflow-x-auto w-full', style: 'min-height: 100vh' }, [
    h('div', { style: `min-width: ${PREVIEW_MIN_WIDTH}px` }, [content])
  ])
}

/** Shadcn: sidebar cố định bên trái bằng position absolute (tránh lỗi flex/fixed trong Storybook). */
function renderShadcnLayout(brandLabel: string, mainContent: ReturnType<typeof h>[], navigation = shadcnNav) {
  const content = mainContent.length ? mainContent : [h('p', { class: 'text-muted-foreground' }, 'Shadcn theme.')]
  const sidebarNode = h(OrShadcnSidebar, {
    navigation,
    isActive: isActiveFn('/workspace'),
    brandLabel,
    collapsible: 'none'
  })
  const insetNode = h(AtSidebarInset, null, () => [
    h(OrShadcnNavbar, { title: 'Dashboard', onLogout: noop }),
    h('div', { class: 'flex-1 p-4 md:p-6' }, content)
  ])
  const layout = h('div', {
    class: CONTAINER_CLASS,
    dir: 'ltr',
    style: 'position: relative; min-height: 100vh; direction: ltr;'
  }, [
    h(AtSidebarProvider, { defaultOpen: true, class: 'min-h-svh w-full', dir: 'ltr' }, () => [
      h('div', { style: 'position: relative; width: 100%; min-height: 100vh;' }, [
        h('div', {
          style: `position: absolute; left: 0; top: 0; bottom: 0; width: ${SIDEBAR_WIDTH}; z-index: 10;`
        }, [sidebarNode]),
        h('div', { style: `margin-left: ${SIDEBAR_WIDTH}; min-height: 100vh;` }, [insetNode])
      ])
    ])
  ])
  return wrapWithScrollable(layout)
}

const ShadcnThemePreview = defineComponent({
  name: 'ShadcnThemePreview',
  components: { OrShadcnSidebar, OrShadcnNavbar, AtSidebarProvider, AtSidebarInset },
  render() {
    return renderShadcnLayout('Shadcn Portal', renderShadcnDashboardContent(), shadcnNav)
  }
})

export const ShadcnTheme: Story = {
  render: () => h(ShadcnThemePreview)
}

/** Windster: navbar top + sidebar trái (windster-theme) */
function renderWindsterThemeLayout(
  getOpen: () => boolean,
  setOpen: (v: boolean) => void,
  mainContent: ReturnType<typeof h>[]
) {
  const layout = h('div', { class: CONTAINER_CLASS + ' min-h-svh bg-muted/30' }, [
    h(OrWindsterNavbar, {
      title: 'Windster',
      searchPlaceholder: 'Search',
      onToggleSidebar: () => setOpen(true)
    }),
    h('div', { class: 'flex overflow-hidden bg-background pt-16' }, [
      h(OrWindsterSidebar, {
        navigation: windsterNav,
        isActive: isActiveFn('/workspace'),
        open: getOpen(),
        'onUpdate:open': setOpen
      }),
      h('div', { class: 'h-full w-full flex-1 overflow-y-auto bg-gray-50 lg:ml-64' }, [
        h('main', { class: 'pt-6 px-4 pb-10' }, mainContent)
      ])
    ])
  ])
  return wrapWithScrollable(layout)
}

const WindsterThemePreview = defineComponent({
  name: 'WindsterThemePreview',
  components: { OrWindsterSidebar, OrWindsterNavbar },
  setup() {
    const open = ref(true)
    return {
      getOpen: () => open.value,
      setOpen: (v: boolean) => { open.value = v }
    }
  },
  render() {
    return renderWindsterThemeLayout(
      this.getOpen,
      this.setOpen,
      renderWindsterDashboardContent()
    )
  }
})

export const WindsterTheme: Story = {
  render: () => h(WindsterThemePreview)
}
