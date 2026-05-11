<script setup lang="ts">
/**
 * SidebarLayout – persistent sidebar + main content (desktop); optional drawer on mobile.
 */
const props = defineProps<{ sidebarWidth?: string }>()
</script>

<template>
  <div class="flex min-h-screen">
    <aside
      class="hidden shrink-0 border-r bg-muted/30 md:block"
      :style="{ width: props.sidebarWidth ?? '16rem' }"
    >
      <slot name="sidebar" />
    </aside>
    <main class="min-w-0 flex-1 overflow-auto p-4">
      <slot />
    </main>
  </div>
</template>
