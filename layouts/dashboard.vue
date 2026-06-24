<script setup lang="ts">
import { LogOut, Settings, User } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu/index'
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

const route = useRoute()
const navigation = useDashboardNav()
const { t } = useI18n()

const pageTitle = computed(() => {
  const name = route.meta.title as string
  if (name) return name
  const path = route.path
  if (path === '/' || path === '/workspace' || path === '/workspace/') return 'Dashboard'
  const segment = path.split('/').filter(Boolean).pop()
  return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : 'Page'
})

const auth = useAuth()

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(path)
}

async function onLogout() {
  await auth.apiLogout()
  await navigateTo('/auth/login')
}
</script>

<template>
  <SidebarProvider :default-open="true" class="min-h-svh w-full">
    <Sidebar side="left" collapsible="icon" class="border-r border-sidebar-border">
      <SidebarHeader class="border-b border-sidebar-border">
        <div class="flex h-14 items-center gap-2 px-3">
          <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-sidebar-foreground">
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground">
              S
            </span>
            <span class="group-data-[collapsible=icon]:hidden">Shadcn Portal</span>
          </NuxtLink>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in navigation" :key="item.path">
                <SidebarMenuButton
                  :as="NuxtLink"
                  :to="item.path"
                  :is-active="isActive(item.path)"
                  :tooltip="item.name"
                >
                  <component :is="item.icon" class="size-5 shrink-0" />
                  <span>{{ item.name }}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter class="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton :as="NuxtLink" to="/workspace/settings" tooltip="Settings">
              <Settings class="size-5 shrink-0" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>

    <SidebarInset>
      <header class="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4">
        <SidebarTrigger class="-ml-1" />
        <div class="flex-1">
          <h1 class="truncate text-lg font-semibold">
            {{ pageTitle }}
          </h1>
        </div>

        <div class="flex items-center gap-2">
          <slot name="navbar-actions" />
          <DropdownMenu>
            <DropdownMenuTrigger class="rounded-full focus:outline-none">
              <span class="inline-flex h-9 w-9 items-center justify-center rounded-full">
                <User class="size-5" />
                <span class="sr-only">Account</span>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-56">
              <div class="flex items-center gap-2 p-2">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <User class="size-4 text-muted-foreground" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-medium">user</span>
                  <span class="text-xs text-muted-foreground">user@example.com</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <NuxtLink to="/workspace/services" class="flex cursor-pointer items-center gap-2">
                  <Settings class="size-4" />
                  {{ t('common.settings') }}
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                class="cursor-pointer text-destructive focus:text-destructive"
                @click="onLogout"
              >
                <LogOut class="size-4" />
                {{ t('common.logout') }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div class="flex-1 p-4 md:p-6">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
