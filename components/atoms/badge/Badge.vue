<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { BadgeVariants } from '~/components/atoms/badge'
import { cn } from '~/utils/cn'
import { badgeVariants } from '~/components/atoms/badge'

const props = defineProps<{
  variant?: BadgeVariants['variant']
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn(badgeVariants({ variant }), props.class)">
    <slot />
  </div>
</template>
