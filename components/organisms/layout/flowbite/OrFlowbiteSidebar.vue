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

const mainItems = computed(() => props.navigation.filter((i) => !i.path.startsWith('/auth')))
const authItems = computed(() => props.navigation.filter((i) => i.path.startsWith('/auth')))

const openGroups = ref<Record<string, boolean>>({ main: true, auth: false })
const expandedParents = ref<Record<string, boolean>>({})

function toggleGroup(key: string) {
  openGroups.value[key] = !openGroups.value[key]
}

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
    if (isAnyChildActive(item)) {
      expandedParents.value[item.path] = true
      if (item.path.startsWith('/auth')) openGroups.value.auth = true
      else openGroups.value.main = true
    }
  }
})
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-10 bg-gray-900/30 lg:hidden"
    aria-hidden="true"
    @click="emit('update:open', false)"
  />
  <!-- Flowbite: divide-y, collapsible groups with chevron, sub-items pl-11 -->
  <aside
    id="flowbite-sidebar"
    class="fixed top-0 left-0 z-20 flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-white pt-16 transition-transform duration-300 dark:border-gray-700 dark:bg-gray-800 lg:translate-x-0"
    :class="[open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']"
    aria-label="Sidebar"
  >
    <div class="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-4 pt-5">
      <div class="mb-4">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white text-sm font-bold">F</span>
          <span>Flowbite</span>
        </NuxtLink>
      </div>
      <div class="flex-1 divide-y divide-gray-200 dark:divide-gray-700">
        <!-- Main group (Dashboard, Tables, etc.) -->
        <div class="space-y-1 py-2">
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded-lg p-2 text-base text-gray-900 transition hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            @click="toggleGroup('main')"
          >
            <component :is="mainItems[0]?.icon" class="size-5 shrink-0 text-gray-500 dark:text-gray-400" />
            <span class="flex-1 text-left">Main</span>
            <ChevronDown
              class="size-5 shrink-0 transition-transform"
              :class="{ 'rotate-180': openGroups.main }"
            />
          </button>
          <ul v-show="openGroups.main" class="space-y-1 py-1">
            <li v-for="item in mainItems" :key="item.path">
              <div
                v-if="hasChildren(item)"
                class="flex items-center gap-1 rounded-lg p-2 pl-11 text-base"
                :class="props.isActive(item.path)
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-900 dark:text-white'"
              >
                <NuxtLink :to="item.path" class="flex min-w-0 flex-1 items-center gap-2" @click="emit('update:open', false)">
                  <component :is="item.icon" class="size-4 shrink-0 text-gray-500 dark:text-gray-400" />
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
                class="flex items-center gap-2 rounded-lg p-2 pl-11 text-base transition-colors"
                :class="isActive(item.path)
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'"
                @click="emit('update:open', false)"
              >
                <component :is="item.icon" class="size-4 shrink-0 text-gray-500 dark:text-gray-400" />
                <span>{{ item.name }}</span>
              </NuxtLink>
              <ul v-if="item.children?.length && isParentExpanded(item)" class="mt-1 space-y-1 pl-14 pr-2">
                <li v-for="child in item.children" :key="child.path">
                  <NuxtLink :to="child.path" class="flex items-center gap-2 rounded-lg p-2 text-sm transition-colors" :class="props.isActive(child.path)
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'" @click="emit('update:open', false)">
                    <component :is="child.icon" class="size-4 shrink-0 text-gray-500 dark:text-gray-400" />
                    <span>{{ child.name }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <!-- Auth group -->
        <div class="space-y-1 py-2">
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded-lg p-2 text-base text-gray-900 transition hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            @click="toggleGroup('auth')"
          >
            <component :is="authItems[0]?.icon" class="size-5 shrink-0 text-gray-500 dark:text-gray-400" />
            <span class="flex-1 text-left">Authentication</span>
            <ChevronDown
              class="size-5 shrink-0 transition-transform"
              :class="{ 'rotate-180': openGroups.auth }"
            />
          </button>
          <ul v-show="openGroups.auth" class="space-y-1 py-1">
            <li v-for="item in authItems" :key="item.path">
              <div
                v-if="hasChildren(item)"
                class="flex items-center gap-1 rounded-lg p-2 pl-11 text-base"
                :class="props.isActive(item.path)
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-900 dark:text-white'"
              >
                <NuxtLink :to="item.path" class="flex min-w-0 flex-1 items-center gap-2" @click="emit('update:open', false)">
                  <component :is="item.icon" class="size-4 shrink-0 text-gray-500 dark:text-gray-400" />
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
                class="flex items-center gap-2 rounded-lg p-2 pl-11 text-base transition-colors"
                :class="isActive(item.path)
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'"
                @click="emit('update:open', false)"
              >
                <component :is="item.icon" class="size-4 shrink-0 text-gray-500 dark:text-gray-400" />
                <span>{{ item.name }}</span>
              </NuxtLink>
              <ul v-if="item.children?.length && isParentExpanded(item)" class="mt-1 space-y-1 pl-14 pr-2">
                <li v-for="child in item.children" :key="child.path">
                  <NuxtLink :to="child.path" class="flex items-center gap-2 rounded-lg p-2 text-sm transition-colors" :class="props.isActive(child.path)
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'" @click="emit('update:open', false)">
                    <component :is="child.icon" class="size-4 shrink-0 text-gray-500 dark:text-gray-400" />
                    <span>{{ child.name }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>
