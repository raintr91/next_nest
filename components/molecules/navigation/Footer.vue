<script setup lang="ts">
const props = defineProps<{ class?: string }>()
</script>

<template>
  <footer :class="['border-t bg-muted/30 py-4 px-4', props.class]">
    <slot />
  </footer>
</template>
