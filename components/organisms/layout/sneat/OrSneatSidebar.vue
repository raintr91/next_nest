<script setup lang="ts">
import type { Component } from 'vue'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'

interface NavItem {
  name: string
  path: string
  icon: Component
  children?: NavItem[]
}

const props = defineProps<{
  navigation: NavItem[]
  isActive: (path: string) => boolean
  open: boolean
}>()

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

const sections = computed(() => {
  const main = props.navigation.filter((i) => !i.path.startsWith('/auth'))
  const account = props.navigation.filter((i) => i.path.startsWith('/auth'))
  return [
    { title: 'Apps', items: main },
    { title: 'Account', items: account }
  ].filter((s) => s.items.length > 0)
})
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-10 bg-gray-900/30 lg:hidden"
    aria-hidden="true"
    @click="emit('update:open', false)"
  />
  <aside
    id="sneat-sidebar"
    class="fixed top-0 left-0 z-20 flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-white pt-16 transition-transform duration-300 dark:border-gray-700 dark:bg-gray-800 lg:translate-x-0"
    :class="[open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']"
    aria-label="Sidebar"
  >
    <!-- Nav header (Sneat style) -->
    <div class="flex shrink-0 items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-700">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 font-bold text-sm">
        S
      </div>
      <span class="text-lg font-semibold text-gray-900 dark:text-white">sneat</span>
    </div>
    <nav class="flex min-h-0 flex-1 flex-col overflow-y-auto py-4">
      <template v-for="(section, idx) in sections" :key="section.title">
        <div v-if="idx > 0" class="my-2 border-t border-gray-100 dark:border-gray-700" />
        <div class="px-4 pb-2">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {{ section.title }}
          </span>
        </div>
        <ul class="space-y-0.5 px-3">
          <li v-for="item in section.items" :key="item.path">
            <div
              v-if="hasChildren(item)"
              class="flex items-center gap-1 rounded-md py-2.5 pl-4 pr-2 text-sm"
              :class="props.isActive(item.path)
                ? 'border-l-4 border-violet-500 bg-violet-500/5 font-medium text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 -ml-px pl-[15px]'
                : 'border-l-4 border-transparent text-gray-600 dark:text-gray-400'"
            >
              <NuxtLink :to="item.path" class="flex min-w-0 flex-1 items-center gap-3" @click="emit('update:open', false)">
                <component :is="item.icon" class="size-5 shrink-0" />
                <span class="truncate">{{ item.name }}</span>
              </NuxtLink>
              <button type="button" class="inline-flex h-7 w-7 items-center justify-center rounded-md text-current/80 hover:bg-black/10 dark:hover:bg-white/10" :aria-label="isParentExpanded(item) ? 'Collapse menu' : 'Expand menu'" @click="toggleParent(item)">
                <ChevronDown v-if="isParentExpanded(item)" class="size-4" />
                <ChevronRight v-else class="size-4" />
              </button>
            </div>
            <NuxtLink
              v-else
              :to="item.path"
              class="flex items-center gap-3 rounded-md py-2.5 pl-4 pr-3 text-sm transition-colors"
              :class="isActive(item.path)
                ? 'border-l-4 border-violet-500 bg-violet-500/5 font-medium text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 -ml-px pl-[15px]'
                : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white'"
              @click="emit('update:open', false)"
            >
              <component :is="item.icon" class="size-5 shrink-0" />
              <span>{{ item.name }}</span>
            </NuxtLink>
            <ul v-if="item.children?.length && isParentExpanded(item)" class="mt-1 space-y-1 pl-9 pr-2">
              <li v-for="child in item.children" :key="child.path">
                <NuxtLink :to="child.path" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors" :class="props.isActive(child.path)
                  ? 'bg-violet-500/10 font-medium text-violet-600 dark:bg-violet-500/20 dark:text-violet-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white'" @click="emit('update:open', false)">
                  <component :is="child.icon" class="size-4 shrink-0" />
                  <span>{{ child.name }}</span>
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </template>
    </nav>
  </aside>
</template>
