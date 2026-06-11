import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { defineComponent, h } from 'vue'

import '~/assets/css/main.css'

import Button from '~/components/ui/button/Button.vue'
import Input from '~/components/ui/input/Input.vue'
import Label from '~/components/ui/label/Label.vue'
import Card from '~/components/ui/card/Card.vue'
import CardHeader from '~/components/ui/card/CardHeader.vue'
import CardTitle from '~/components/ui/card/CardTitle.vue'
import CardDescription from '~/components/ui/card/CardDescription.vue'
import CardContent from '~/components/ui/card/CardContent.vue'
import CardFooter from '~/components/ui/card/CardFooter.vue'
import Table from '~/components/ui/table/Table.vue'
import TableBody from '~/components/ui/table/TableBody.vue'
import TableCell from '~/components/ui/table/TableCell.vue'
import TableHead from '~/components/ui/table/TableHead.vue'
import TableHeader from '~/components/ui/table/TableHeader.vue'
import TableRow from '~/components/ui/table/TableRow.vue'
import DropdownMenu from '~/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuTrigger from '~/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from '~/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '~/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuSeparator from '~/components/ui/dropdown-menu/DropdownMenuSeparator.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '~/components/ui/sidebar/index'

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

  app.component('Button', Button)
  app.component('Input', Input)
  app.component('Label', Label)
  app.component('Card', Card)
  app.component('CardHeader', CardHeader)
  app.component('CardTitle', CardTitle)
  app.component('CardDescription', CardDescription)
  app.component('CardContent', CardContent)
  app.component('CardFooter', CardFooter)
  app.component('Table', Table)
  app.component('TableBody', TableBody)
  app.component('TableCell', TableCell)
  app.component('TableHead', TableHead)
  app.component('TableHeader', TableHeader)
  app.component('TableRow', TableRow)
  app.component('DropdownMenu', DropdownMenu)
  app.component('DropdownMenuTrigger', DropdownMenuTrigger)
  app.component('DropdownMenuContent', DropdownMenuContent)
  app.component('DropdownMenuItem', DropdownMenuItem)
  app.component('DropdownMenuSeparator', DropdownMenuSeparator)
  app.component('Sidebar', Sidebar)
  app.component('SidebarContent', SidebarContent)
  app.component('SidebarFooter', SidebarFooter)
  app.component('SidebarGroup', SidebarGroup)
  app.component('SidebarGroupContent', SidebarGroupContent)
  app.component('SidebarHeader', SidebarHeader)
  app.component('SidebarInset', SidebarInset)
  app.component('SidebarMenu', SidebarMenu)
  app.component('SidebarMenuButton', SidebarMenuButton)
  app.component('SidebarMenuItem', SidebarMenuItem)
  app.component('SidebarProvider', SidebarProvider)
  app.component('SidebarTrigger', SidebarTrigger)

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
