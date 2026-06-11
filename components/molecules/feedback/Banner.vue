<script setup lang="ts">
/**
 * Banner – persistent bar with message and optional action. Ref: Vuetify Banner.
 */
const props = defineProps<{
  title?: string
  visible?: boolean
}>()
const emit = defineEmits<{ (e: 'dismiss'): void }>()
</script>

<template>
  <div
    v-if="props.visible !== false"
    class="flex items-center justify-between gap-4 border-b bg-muted/50 px-4 py-2 text-sm"
  >
    <span class="flex-1">{{ props.title }}</span>
    <div class="flex items-center gap-2">
      <slot name="action" />
      <Button variant="ghost" size="icon" aria-label="Dismiss" @click="emit('dismiss')">
        <slot name="dismiss">×</slot>
      </Button>
    </div>
  </div>
</template>
