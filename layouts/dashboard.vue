<script setup lang="ts">
const ThemeLayout = defineAsyncComponent(() => import('~/layouts/themes/mairy-theme.vue'))
</script>

<template>
  <Suspense>
    <ThemeLayout>
      <template #default>
        <slot />
      </template>
      <template #navbar-actions>
        <slot name="navbar-actions" />
      </template>
    </ThemeLayout>
    <template #fallback>
      <div class="flex min-h-svh items-center justify-center bg-background">
        <span class="text-muted-foreground">Loading...</span>
      </div>
    </template>
  </Suspense>
</template>
