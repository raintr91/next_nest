<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    fluid?: boolean
    class?: HTMLAttributes['class']
  }>(),
  { fluid: false }
)
</script>

<template>
  <div
    :class="
      cn(
        'mx-auto w-full px-4 sm:px-6',
        props.fluid ? 'max-w-none' : 'max-w-7xl',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
