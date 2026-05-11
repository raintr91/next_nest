<script setup lang="ts">
import { Menu, Search } from 'lucide-vue-next'

defineProps<{
  title?: string
  searchPlaceholder?: string
}>()

const emit = defineEmits<{ (e: 'toggle-sidebar'): void }>()
const { t } = useI18n()
</script>

<template>
  <header
    class="sticky top-0 z-30 flex w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="flex w-full items-center justify-between gap-2 px-3 py-3 lg:px-6">
      <div class="flex items-center gap-2">
        <AtButton
          variant="ghost"
          size="icon"
          class="lg:flex h-10 w-10 shrink-0 rounded-lg border border-gray-200 dark:border-gray-800"
          aria-label="Toggle sidebar"
          @click="emit('toggle-sidebar')"
        >
          <Menu class="size-5" />
        </AtButton>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {{ title ?? 'Dashboard' }}
        </h1>
        <div class="hidden lg:block lg:pl-8">
          <div class="relative w-64">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
              <Search class="size-5" />
            </span>
            <AtInput
              type="text"
              :placeholder="searchPlaceholder ?? 'Search...'"
              class="pl-10 h-10 border-gray-200 dark:border-gray-800"
            />
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <slot name="actions" />
        <AtDropdownMenu>
          <AtDropdownMenuTrigger class="rounded-full focus:outline-none">
            <span class="inline-flex h-9 w-9 items-center justify-center rounded-full">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                U
              </span>
              <span class="sr-only">User menu</span>
            </span>
          </AtDropdownMenuTrigger>
          <AtDropdownMenuContent align="end" class="w-56">
            <div class="flex items-center gap-2 p-2">
              <span class="text-sm font-medium">User</span>
              <span class="text-xs text-gray-500">user@example.com</span>
            </div>
            <AtDropdownMenuSeparator />
            <AtDropdownMenuItem>
              <NuxtLink to="/workspace/services" class="cursor-pointer">{{ t('common.settings') }}</NuxtLink>
            </AtDropdownMenuItem>
            <AtDropdownMenuSeparator />
            <AtDropdownMenuItem class="text-red-600 cursor-pointer">{{ t('common.logout') }}</AtDropdownMenuItem>
          </AtDropdownMenuContent>
        </AtDropdownMenu>
      </div>
    </div>
  </header>
</template>
