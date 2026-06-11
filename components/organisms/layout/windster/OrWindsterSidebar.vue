<script setup lang="ts">
import type { Component } from 'vue'
import { BookOpen, ChevronDown, ChevronRight, Gem, HelpCircle, LayoutPanelLeft, Search } from 'lucide-vue-next'

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
    open: boolean
  }>(),
  {}
)

const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()

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
  <div
    v-if="props.open"
    class="fixed inset-0 z-10 bg-foreground/50 md:hidden"
    aria-hidden="true"
    @click="emit('update:open', false)"
  />
  <aside
    id="windster-sidebar"
    class="fixed top-0 left-0 z-20 flex h-full w-64 shrink-0 flex-col border-r border-border bg-background pt-16 transition-transform duration-200 lg:translate-x-0"
    :class="[props.open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']"
    aria-label="Sidebar"
  >
    <div class="relative flex min-h-0 flex-1 flex-col pt-5 pb-4">
      <div class="flex-1 space-y-1 px-3">
        <ul class="space-y-1 pb-2">
          <li class="lg:hidden">
            <div class="relative">
              <Input
                type="text"
                placeholder="Search"
                class="pl-10"
              />
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <Search class="size-5" />
              </span>
            </div>
          </li>
          <li v-for="item in props.navigation" :key="item.path">
            <div
              v-if="hasChildren(item)"
              class="flex items-center rounded-lg p-2 text-base"
              :class="props.isActive(item.path)
                ? 'bg-muted font-medium text-foreground'
                : 'text-muted-foreground'"
            >
              <NuxtLink
                :to="item.path"
                class="flex min-w-0 flex-1 items-center"
                @click="emit('update:open', false)"
              >
                <component :is="item.icon" class="size-6 shrink-0" />
                <span class="ml-3 truncate">{{ item.name }}</span>
              </NuxtLink>
              <button
                type="button"
                class="inline-flex h-7 w-7 items-center justify-center rounded-md text-current/80 hover:bg-black/10 dark:hover:bg-white/10"
                :aria-label="isParentExpanded(item) ? 'Collapse menu' : 'Expand menu'"
                @click="toggleParent(item)"
              >
                <ChevronDown v-if="isParentExpanded(item)" class="size-4" />
                <ChevronRight v-else class="size-4" />
              </button>
            </div>
            <NuxtLink
              v-else
              :to="item.path"
              class="flex items-center rounded-lg p-2 text-base transition-colors"
              :class="props.isActive(item.path)
                ? 'bg-muted font-medium text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
              @click="emit('update:open', false)"
            >
              <component :is="item.icon" class="size-6 shrink-0" />
              <span class="ml-3">{{ item.name }}</span>
            </NuxtLink>
            <ul v-if="item.children?.length && isParentExpanded(item)" class="mt-1 space-y-1 pl-9">
              <li v-for="child in item.children" :key="child.path">
                <NuxtLink
                  :to="child.path"
                  class="flex items-center rounded-lg p-2 text-sm transition-colors"
                  :class="props.isActive(child.path)
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
                  @click="emit('update:open', false)"
                >
                  <component :is="child.icon" class="size-5 shrink-0" />
                  <span class="ml-3">{{ child.name }}</span>
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
        <div class="space-y-1 border-t border-border pt-2">
          <NuxtLink
            to="/workspace/pricing"
            class="flex items-center rounded-lg p-2 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Gem class="size-5 shrink-0" />
            <span class="ml-4">Upgrade to Pro</span>
          </NuxtLink>
          <a
            href="#"
            class="flex items-center rounded-lg p-2 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <BookOpen class="size-6 shrink-0" />
            <span class="ml-3">Documentation</span>
          </a>
          <a
            href="#"
            class="flex items-center rounded-lg p-2 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LayoutPanelLeft class="size-6 shrink-0" />
            <span class="ml-3">Components</span>
          </a>
          <a
            href="#"
            class="flex items-center rounded-lg p-2 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <HelpCircle class="size-6 shrink-0" />
            <span class="ml-3">Help</span>
          </a>
        </div>
      </div>
    </div>
  </aside>
</template>
