<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { AlertVariants } from '~/components/atoms/alert'
import { cn } from '~/utils/cn'
import { alertVariants } from '~/components/atoms/alert'

const props = defineProps<{
  class?: HTMLAttributes['class']
  variant?: AlertVariants['variant']
}>()
</script>

<template>
  <div :class="cn(alertVariants({ variant }), props.class)" role="alert">
    <slot />
  </div>
</template>
