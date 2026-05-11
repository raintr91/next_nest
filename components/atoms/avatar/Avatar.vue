<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { AvatarVariants } from '~/components/atoms/avatar'
import { cn } from '~/utils/cn'
import { AvatarRoot } from 'radix-vue'
import { avatarVariant } from '~/components/atoms/avatar'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  size?: AvatarVariants['size']
  shape?: AvatarVariants['shape']
}>(), {
  size: 'sm',
  shape: 'circle',
})
</script>

<template>
  <AvatarRoot :class="cn(avatarVariant({ size, shape }), props.class)">
    <slot />
  </AvatarRoot>
</template>
