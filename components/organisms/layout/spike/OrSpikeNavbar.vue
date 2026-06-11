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
    class="sticky top-0 z-30 flex w-full border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-700 dark:bg-gray-800/90"
  >
    <div class="flex w-full items-center justify-between gap-2 px-4 py-3 lg:px-8">
      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          class="lg:flex h-10 w-10 shrink-0 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          aria-label="Toggle sidebar"
          @click="emit('toggle-sidebar')"
        >
          <Menu class="size-5" />
        </Button>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {{ title ?? 'Dashboard' }}
        </h1>
        <div class="hidden lg:block lg:pl-8">
          <div class="relative w-64">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
              <Search class="size-5" />
            </span>
            <Input
              type="text"
              :placeholder="searchPlaceholder ?? 'Search...'"
              class="pl-10 h-10 border-gray-200 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <slot name="actions" />
        <DropdownMenu>
          <DropdownMenuTrigger class="rounded-full focus:outline-none">
            <span class="inline-flex h-9 w-9 items-center justify-center rounded-full">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                U
              </span>
              <span class="sr-only">User menu</span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-56">
            <div class="flex items-center gap-2 p-2">
              <span class="text-sm font-medium">User</span>
              <span class="text-xs text-gray-500">user@example.com</span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <NuxtLink to="/workspace/services" class="cursor-pointer">{{ t('common.settings') }}</NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="text-red-600 cursor-pointer">{{ t('common.logout') }}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>
