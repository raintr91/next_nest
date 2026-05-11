<script setup lang="ts">
import { computed } from 'vue'
import type { PopoverTriggerProps } from 'radix-vue'
import { PopoverTrigger, useForwardProps } from 'radix-vue'

const props = defineProps<PopoverTriggerProps>()

const delegatedProps = computed(() => {
  const { asChild: _asChild, as: _as, ...delegated } = props
  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <PopoverTrigger
    as="span"
    :as-child="false"
    class="inline-flex"
    v-bind="forwardedProps"
  >
    <slot />
  </PopoverTrigger>
</template>
