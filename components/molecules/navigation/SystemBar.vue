<script setup lang="ts">
/**
 * SystemBar – thin top bar (icons, time). Ref: Vuetify System bar.
 */
</script>

<template>
  <div class="flex h-6 items-center justify-end gap-2 border-b bg-muted/50 px-2 text-xs text-muted-foreground">
    <slot />
  </div>
</template>
