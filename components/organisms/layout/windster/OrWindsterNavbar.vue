<script setup lang="ts">
import { Menu, Search } from 'lucide-vue-next'

defineProps<{
  title?: string
  searchPlaceholder?: string
}>()

const emit = defineEmits<{ (e: 'toggle-sidebar'): void }>()
</script>

<template>
  <nav class="fixed z-30 w-full border-b border-border bg-background">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start">
          <Button
            variant="ghost"
            size="icon"
            class="lg:hidden mr-2"
            aria-label="Toggle sidebar"
            @click="emit('toggle-sidebar')"
          >
            <Menu class="size-6" />
          </Button>
          <NuxtLink
            to="/"
            class="flex items-center text-xl font-bold lg:ml-2.5"
          >
            <span class="self-center whitespace-nowrap">{{ title ?? 'Windster' }}</span>
          </NuxtLink>
          <div class="hidden lg:block lg:pl-32">
            <div class="relative mt-1 lg:w-64">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <Search class="size-5" />
              </span>
              <Input
                type="text"
                :placeholder="searchPlaceholder ?? 'Search'"
                class="pl-10 bg-muted/50 border-border"
              />
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            class="lg:hidden"
            aria-label="Search"
          >
            <Search class="size-6" />
          </Button>
          <div class="hidden lg:flex items-center">
            <span class="mr-5 text-base text-muted-foreground">Open source ❤️</span>
          </div>
          <slot name="actions" />
        </div>
      </div>
    </div>
  </nav>
</template>
