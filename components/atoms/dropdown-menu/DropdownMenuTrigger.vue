<script setup lang="ts">
import { computed } from 'vue'
import type { DropdownMenuTriggerProps } from 'radix-vue'
import { DropdownMenuTrigger, useForwardProps } from 'radix-vue'

const props = defineProps<DropdownMenuTriggerProps>()

const delegatedProps = computed(() => {
  const { asChild: _asChild, as: _as, ...delegated } = props
  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DropdownMenuTrigger
    as="span"
    :as-child="false"
    class="outline-none inline-flex"
    v-bind="forwardedProps"
  >
    <slot />
  </DropdownMenuTrigger>
</template>
