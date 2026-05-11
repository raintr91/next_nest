<script setup lang="ts">
import { cn } from '~/utils/cn'
import { buttonVariants, type ButtonVariants } from '~/components/atoms/button/buttonVariants'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariants['variant']
    size?: ButtonVariants['size']
    class?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    type: 'button'
  }
)
</script>

<template>
  <button :type="props.type" :disabled="props.disabled" :class="cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)">
    <slot />
  </button>
</template>
