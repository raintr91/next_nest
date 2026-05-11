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
  const menu = props.navigation.filter((i) => !i.path.startsWith('/auth'))
  const account = props.navigation.filter((i) => i.path.startsWith('/auth'))
  return [
    { title: 'Menu', items: menu },
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
  <!-- Notus: card-like sidebar, shadow, light bg, indigo accent -->
  <aside
    id="notus-sidebar"
    class="fixed top-0 left-0 z-20 flex h-full w-64 shrink-0 flex-col pt-16 transition-transform duration-300 lg:translate-x-0"
    :class="[open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']"
    aria-label="Sidebar"
  >
    <div class="flex h-full min-h-0 flex-1 flex-col rounded-r-2xl border border-gray-200 border-l-0 bg-gray-50/90 shadow-sm dark:border-gray-700 dark:bg-gray-800/90">
      <div class="shrink-0 border-b border-gray-200 px-5 py-4 dark:border-gray-700">
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/25 shadow-sm">N</span>
          <span>Notus</span>
        </NuxtLink>
      </div>
      <nav class="flex-1 overflow-y-auto p-4">
        <template v-for="section in sections" :key="section.title">
          <p class="mb-2 mt-4 first:mt-0 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {{ section.title }}
          </p>
          <ul class="space-y-1">
            <li v-for="item in section.items" :key="item.path">
              <div
                v-if="hasChildren(item)"
                class="flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-medium"
                :class="props.isActive(item.path)
                  ? 'bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400'"
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
                class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
                :class="isActive(item.path)
                  ? 'bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-300'
                  : 'text-gray-600 hover:bg-white hover:shadow dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white'"
                @click="emit('update:open', false)"
              >
                <component :is="item.icon" class="size-5 shrink-0" />
                <span>{{ item.name }}</span>
              </NuxtLink>
              <ul v-if="item.children?.length && isParentExpanded(item)" class="mt-1 space-y-1 pl-7 pr-2">
                <li v-for="child in item.children" :key="child.path">
                  <NuxtLink :to="child.path" class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors" :class="props.isActive(child.path)
                    ? 'bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-300'
                    : 'text-gray-600 hover:bg-white hover:shadow dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white'" @click="emit('update:open', false)">
                    <component :is="child.icon" class="size-4 shrink-0" />
                    <span>{{ child.name }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </template>
      </nav>
    </div>
  </aside>
</template>
