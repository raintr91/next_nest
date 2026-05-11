<script setup lang="ts">
import type { ToastRootEmits } from 'radix-vue'
import type { ToastProps } from '~/components/atoms/toast'
import { cn } from '~/utils/cn'
import { ToastRoot, useForwardPropsEmits } from 'radix-vue'
import { computed } from 'vue'
import { toastVariants } from '~/components/atoms/toast'

const props = defineProps<ToastProps>()

const emits = defineEmits<ToastRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ToastRoot
    v-bind="forwarded"
    :class="cn(toastVariants({ variant }), props.class)"
    @update:open="onOpenChange"
  >
    <slot />
  </ToastRoot>
</template>
