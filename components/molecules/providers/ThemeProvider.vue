<script setup lang="ts">
/**
 * ThemeProvider – wrap content and set theme (class or attribute). Ref: Vuetify Theme provider.
 */
const props = defineProps<{ theme?: 'light' | 'dark' | 'system' }>()
</script>

<template>
  <div :data-theme="props.theme ?? 'system'" class="contents">
    <slot />
  </div>
</template>
