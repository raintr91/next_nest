<script setup lang="ts">
/**
 * AvatarStack – group of avatars overlapping. Reference: Vuetify Avatar (images and icons).
 */
const props = defineProps<{ max?: number }>()
</script>

<template>
  <div class="flex -space-x-2">
    <slot />
  </div>
</template>
