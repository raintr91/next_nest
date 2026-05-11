<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    noGutters?: boolean
    align?: 'start' | 'center' | 'end'
    justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
    class?: HTMLAttributes['class']
  }>(),
  { noGutters: false, align: 'start', justify: 'start' }
)

const alignMap: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end'
}
const justifyMap: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  'space-between': 'justify-between',
  'space-around': 'justify-around'
}
</script>

<template>
  <div
    :class="
      cn(
        'grid grid-cols-12',
        props.noGutters ? 'gap-0' : 'gap-4',
        alignMap[props.align],
        justifyMap[props.justify],
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
