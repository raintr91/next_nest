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
</script>

<template>
  <div
    v-if="props.open"
    class="fixed inset-0 z-10 bg-gray-900/30 lg:hidden"
    aria-hidden="true"
    @click="emit('update:open', false)"
  />
  <!-- Aurora: indigo accent, underline-style active indicator -->
  <aside
    id="aurora-sidebar"
    class="fixed top-0 left-0 z-20 flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-white pt-16 transition-transform duration-300 dark:border-gray-700 dark:bg-gray-800 lg:translate-x-0"
    :class="[props.open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']"
    aria-label="Sidebar"
  >
    <div class="flex min-h-0 flex-1 flex-col p-4">
      <div class="mb-6">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/25">A</span>
          <span>Aurora</span>
        </NuxtLink>
      </div>
      <nav class="flex-1 overflow-y-auto">
        <ul class="space-y-0.5">
          <li v-for="item in props.navigation" :key="item.path">
            <div v-if="hasChildren(item)" class="flex items-center border-b-2 border-transparent py-2.5 px-2">
              <NuxtLink
                :to="item.path"
                class="flex min-w-0 flex-1 items-center gap-3 text-sm"
                :class="props.isActive(item.path)
                  ? 'font-medium text-indigo-600 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400'"
                @click="emit('update:open', false)"
              >
                <component :is="item.icon" class="size-5 shrink-0" />
                <span class="truncate">{{ item.name }}</span>
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
              class="flex items-center gap-3 border-b-2 border-transparent py-2.5 px-2 text-sm transition-colors hover:border-gray-200 dark:hover:border-gray-600"
              :class="props.isActive(item.path)
                ? 'border-indigo-500 font-medium text-indigo-600 dark:border-indigo-400 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400'"
              @click="emit('update:open', false)"
            >
              <component :is="item.icon" class="size-5 shrink-0" />
              <span>{{ item.name }}</span>
            </NuxtLink>
            <ul v-if="item.children?.length && isParentExpanded(item)" class="space-y-0.5 pl-7 pb-2">
              <li v-for="child in item.children" :key="child.path">
                <NuxtLink
                  :to="child.path"
                  class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                  :class="props.isActive(child.path)
                    ? 'font-medium text-indigo-600 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
                  @click="emit('update:open', false)"
                >
                  <component :is="child.icon" class="size-4 shrink-0" />
                  <span>{{ child.name }}</span>
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>
