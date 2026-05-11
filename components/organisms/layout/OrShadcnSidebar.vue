<script setup lang="ts">
import type { Component } from 'vue'
import { ChevronDown, ChevronRight, Settings } from 'lucide-vue-next'

interface NavItem {
  name: string
  path: string
  icon: Component
  children?: NavItem[]
}

const props = withDefaults(
  defineProps<{
    navigation: NavItem[]
    isActive: (path: string) => boolean
    brandLabel?: string
    /** 'none' = sidebar in flow (không fixed), dùng trong Storybook để sidebar luôn bên trái */
    collapsible?: 'offcanvas' | 'icon' | 'none'
  }>(),
  { collapsible: 'icon' }
)

const expandedParents = ref<Record<string, boolean>>({})

function hasChildren(item: NavItem) {
  return Boolean(item.children?.length)
}

function isParentExpanded(item: NavItem) {
  return Boolean(expandedParents.value[item.path])
}

function toggleParent(item: NavItem) {
  expandedParents.value[item.path] = !isParentExpanded(item)
}

function isAnyChildActive(item: NavItem) {
  return Boolean(item.children?.some((child) => props.isActive(child.path)))
}

watchEffect(() => {
  for (const item of props.navigation) {
    if (!item.children?.length) continue
    if (isAnyChildActive(item)) expandedParents.value[item.path] = true
  }
})
</script>

<template>
  <AtSidebar side="left" :collapsible="props.collapsible" class="border-r border-sidebar-border">
    <AtSidebarHeader class="border-b border-sidebar-border">
      <div class="flex h-14 items-center gap-2 px-3">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-sidebar-foreground">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium">S</span>
          <span class="group-data-[collapsible=icon]:hidden">{{ props.brandLabel ?? 'Shadcn Portal' }}</span>
        </NuxtLink>
      </div>
    </AtSidebarHeader>
    <AtSidebarContent>
      <AtSidebarGroup>
        <AtSidebarGroupContent>
          <AtSidebarMenu>
            <AtSidebarMenuItem v-for="item in props.navigation" :key="item.path">
              <div v-if="hasChildren(item)" class="flex items-center">
                <AtSidebarMenuButton :as="NuxtLink" :to="item.path" :is-active="props.isActive(item.path)" :tooltip="item.name" class="flex-1">
                  <component :is="item.icon" class="size-5 shrink-0" />
                  <span>{{ item.name }}</span>
                </AtSidebarMenuButton>
                <button
                  type="button"
                  class="mr-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent"
                  :aria-label="isParentExpanded(item) ? 'Collapse menu' : 'Expand menu'"
                  @click="toggleParent(item)"
                >
                  <ChevronDown v-if="isParentExpanded(item)" class="size-4" />
                  <ChevronRight v-else class="size-4" />
                </button>
              </div>
              <AtSidebarMenuButton v-else :as="NuxtLink" :to="item.path" :is-active="props.isActive(item.path)" :tooltip="item.name">
                <component :is="item.icon" class="size-5 shrink-0" />
                <span>{{ item.name }}</span>
              </AtSidebarMenuButton>
              <AtSidebarMenu v-if="item.children?.length && isParentExpanded(item)" class="pl-6">
                <AtSidebarMenuItem v-for="child in item.children" :key="child.path">
                  <AtSidebarMenuButton :as="NuxtLink" :to="child.path" :is-active="props.isActive(child.path)" :tooltip="child.name">
                    <component :is="child.icon" class="size-4 shrink-0" />
                    <span>{{ child.name }}</span>
                  </AtSidebarMenuButton>
                </AtSidebarMenuItem>
              </AtSidebarMenu>
            </AtSidebarMenuItem>
          </AtSidebarMenu>
        </AtSidebarGroupContent>
      </AtSidebarGroup>
    </AtSidebarContent>
    <AtSidebarFooter class="border-t border-sidebar-border">
      <AtSidebarMenu>
        <AtSidebarMenuItem>
          <AtSidebarMenuButton :as="NuxtLink" to="/workspace/settings" :tooltip="'Settings'">
            <Settings class="size-5 shrink-0" />
            <span>Settings</span>
          </AtSidebarMenuButton>
        </AtSidebarMenuItem>
      </AtSidebarMenu>
    </AtSidebarFooter>
  </AtSidebar>
</template>
