<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils/cn'

/**
 * Overlay – full-screen scrim with optional content. Ref: Vuetify Overlay.
 */
const props = defineProps<{
  open?: boolean
  class?: HTMLAttributes['class']
}>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.open"
      :class="cn('fixed inset-0 z-50 bg-black/50', props.class)"
        role="presentation"
        @click="emit('update:open', false)"
      >
        <div class="flex h-full w-full items-center justify-center p-4" @click.stop>
          <slot />
        </div>
      </div>
  </Teleport>
</template>
