<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils/cn'

const props = defineProps<{
  title?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <header
    :class="
      cn(
        'sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4',
        props.class
      )
    "
  >
    <slot name="leading" />
    <h1 v-if="title" class="text-lg font-semibold">{{ title }}</h1>
    <slot name="title" />
    <div class="flex-1" />
    <div class="flex items-center gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>
