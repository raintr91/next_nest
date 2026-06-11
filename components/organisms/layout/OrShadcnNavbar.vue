<script setup lang="ts">
import { User, LogOut, Settings } from 'lucide-vue-next'

defineProps<{ title: string }>()
const emit = defineEmits<{ (e: 'logout'): void }>()
const { t } = useI18n()
</script>

<template>
  <header class="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4">
    <SidebarTrigger class="-ml-1" />
    <div class="flex-1">
      <h1 class="text-lg font-semibold truncate">{{ title }}</h1>
    </div>
    <div class="flex items-center gap-2">
      <slot name="actions" />
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
            class="text-destructive focus:text-destructive cursor-pointer"
            @click="emit('logout')"
          >
            <LogOut class="size-4" />
            {{ t('common.logout') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
