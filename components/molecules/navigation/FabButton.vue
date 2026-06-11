<script setup lang="ts">
const props = defineProps<{ position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' }>()
const posMap = { 'bottom-right': 'bottom-6 right-6', 'bottom-left': 'bottom-6 left-6', 'top-right': 'top-6 right-6', 'top-left': 'top-6 left-6' }
const pos = posMap[props.position ?? 'bottom-right']
</script>

<template>
  <div :class="['fixed z-40', pos]">
    <Button size="icon" class="h-12 w-12 rounded-full shadow-lg">
      <slot />
    </Button>
  </div>
</template>
