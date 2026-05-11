<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils/cn'

/**
 * Sheet – simple paper container (elevation, rounded). Ref: Vuetify Sheet.
 */
const props = defineProps<{
  elevation?: 0 | 1 | 2
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="
      cn(
        'rounded-lg border bg-card text-card-foreground',
        props.elevation === 1 && 'shadow-sm',
        props.elevation === 2 && 'shadow',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
