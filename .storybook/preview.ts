import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { defineComponent, h } from 'vue'

import '~/assets/css/main.css'

import AtButton from '~/components/atoms/button/Button.vue'
import AtInput from '~/components/atoms/input/Input.vue'
import AtLabel from '~/components/atoms/label/Label.vue'
import AtCard from '~/components/atoms/card/Card.vue'
import AtCardHeader from '~/components/atoms/card/CardHeader.vue'
import AtCardTitle from '~/components/atoms/card/CardTitle.vue'
import AtCardDescription from '~/components/atoms/card/CardDescription.vue'
import AtCardContent from '~/components/atoms/card/CardContent.vue'
import AtCardFooter from '~/components/atoms/card/CardFooter.vue'
import AtTable from '~/components/atoms/table/Table.vue'
import AtTableBody from '~/components/atoms/table/TableBody.vue'
import AtTableCell from '~/components/atoms/table/TableCell.vue'
import AtTableHead from '~/components/atoms/table/TableHead.vue'
import AtTableHeader from '~/components/atoms/table/TableHeader.vue'
import AtTableRow from '~/components/atoms/table/TableRow.vue'
import AtDropdownMenu from '~/components/atoms/dropdown-menu/DropdownMenu.vue'
import AtDropdownMenuTrigger from '~/components/atoms/dropdown-menu/DropdownMenuTrigger.vue'
import AtDropdownMenuContent from '~/components/atoms/dropdown-menu/DropdownMenuContent.vue'
import AtDropdownMenuItem from '~/components/atoms/dropdown-menu/DropdownMenuItem.vue'
import AtDropdownMenuSeparator from '~/components/atoms/dropdown-menu/DropdownMenuSeparator.vue'
import {
  Sidebar as AtSidebar,
  SidebarContent as AtSidebarContent,
  SidebarFooter as AtSidebarFooter,
  SidebarGroup as AtSidebarGroup,
  SidebarGroupContent as AtSidebarGroupContent,
  SidebarHeader as AtSidebarHeader,
  SidebarInset as AtSidebarInset,
  SidebarMenu as AtSidebarMenu,
  SidebarMenuButton as AtSidebarMenuButton,
  SidebarMenuItem as AtSidebarMenuItem,
  SidebarProvider as AtSidebarProvider,
  SidebarTrigger as AtSidebarTrigger
} from '~/components/atoms/sidebar/index'

setup((app) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
    {
      path: '/:pathMatch(.*)',
      name: 'story',
      component: defineComponent({ name: 'StoryRoute', render: () => h('div') })
    }
  ]
  })
  router.replace('/')
  app.use(router)

  app.component('AtButton', AtButton)
  app.component('AtInput', AtInput)
  app.component('AtLabel', AtLabel)
  app.component('AtCard', AtCard)
  app.component('AtCardHeader', AtCardHeader)
  app.component('AtCardTitle', AtCardTitle)
  app.component('AtCardDescription', AtCardDescription)
  app.component('AtCardContent', AtCardContent)
  app.component('AtCardFooter', AtCardFooter)
  app.component('AtTable', AtTable)
  app.component('AtTableBody', AtTableBody)
  app.component('AtTableCell', AtTableCell)
  app.component('AtTableHead', AtTableHead)
  app.component('AtTableHeader', AtTableHeader)
  app.component('AtTableRow', AtTableRow)
  app.component('AtDropdownMenu', AtDropdownMenu)
  app.component('AtDropdownMenuTrigger', AtDropdownMenuTrigger)
  app.component('AtDropdownMenuContent', AtDropdownMenuContent)
  app.component('AtDropdownMenuItem', AtDropdownMenuItem)
  app.component('AtDropdownMenuSeparator', AtDropdownMenuSeparator)
  app.component('AtSidebar', AtSidebar)
  app.component('AtSidebarContent', AtSidebarContent)
  app.component('AtSidebarFooter', AtSidebarFooter)
  app.component('AtSidebarGroup', AtSidebarGroup)
  app.component('AtSidebarGroupContent', AtSidebarGroupContent)
  app.component('AtSidebarHeader', AtSidebarHeader)
  app.component('AtSidebarInset', AtSidebarInset)
  app.component('AtSidebarMenu', AtSidebarMenu)
  app.component('AtSidebarMenuButton', AtSidebarMenuButton)
  app.component('AtSidebarMenuItem', AtSidebarMenuItem)
  app.component('AtSidebarProvider', AtSidebarProvider)
  app.component('AtSidebarTrigger', AtSidebarTrigger)

  // NuxtLink mock: no template string to avoid runtime compileToFunction
  app.component(
    'NuxtLink',
    defineComponent({
      name: 'NuxtLink',
      props: { to: { type: [String, Object], required: true } },
      render() {
        const to = this.to as string | { path?: string }
        const href = typeof to === 'string' ? to : (to?.path ?? '#')
        return h('a', { href }, this.$slots.default?.())
      }
    })
  )

  // Pinia state is commonly used in components.
  app.use(createPinia())

  // i18n fallback: allow using `$t('key')` without Nuxt i18n context.
  app.config.globalProperties.$t = (key: string) => key
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } }
  },
  decorators: [
    (story) => ({
      render() {
        return h(
          'div',
          {
            dir: 'ltr',
            class: 'light sb-dashboard-preview',
            style: 'min-height: 100vh; width: 100%;'
          },
          [h(story() as any)]
        )
      }
    })
  ]
}
