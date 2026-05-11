<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils/cn'

/** List group – list of items with optional dividers. Ref: Vuetify List. */
const props = defineProps<{
  divided?: boolean
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('flex flex-col rounded-md border bg-card', props.class)">
    <slot />
  </div>
</template>
