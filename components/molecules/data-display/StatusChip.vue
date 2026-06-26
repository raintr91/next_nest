<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    tone?: 'success' | 'danger' | 'warning' | 'info' | 'muted'
    label: string
    class?: HTMLAttributes['class']
    testId?: string
  }>(),
  {
    tone: 'muted',
    class: undefined,
    testId: undefined
  }
)

const toneClass = computed(() => {
  const tones = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    danger: 'border-red-200 bg-red-50 text-red-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    info: 'border-blue-200 bg-blue-50 text-blue-700',
    muted: 'border-muted bg-muted/60 text-muted-foreground'
  }

  return tones[props.tone]
})
</script>

<template>
  <span
    :class="cn(
      'inline-flex max-w-[140px] items-center rounded-full border px-2 py-0.5 text-xs font-medium leading-5 shadow-none',
      toneClass,
      props.class
    )"
    :data-testid="props.testId"
    :title="props.label"
  >
    <span class="truncate">{{ props.label }}</span>
  </span>
</template>
