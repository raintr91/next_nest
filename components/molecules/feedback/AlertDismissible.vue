<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'
import { cn } from '~/utils/cn'

const props = defineProps<{
  variant?: 'default' | 'destructive'
  class?: HTMLAttributes['class']
  testId?: string
}>()
const visible = ref(true)
const emit = defineEmits<{ (e: 'close'): void }>()
function close() {
  visible.value = false
  emit('close')
}
</script>

<template>
  <Alert v-if="visible" :variant="variant" :class="cn('relative pr-10', props.class)" role="alert" :data-testid="testId">
    <slot />
    <Button variant="ghost" size="icon" class="absolute right-2 top-2 h-6 w-6" aria-label="Close" @click="close">
      <span class="sr-only">Close</span>
      <span aria-hidden="true">×</span>
    </Button>
  </Alert>
</template>
