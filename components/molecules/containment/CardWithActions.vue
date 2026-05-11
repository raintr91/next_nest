<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils/cn'

/**
 * CardWithActions – card with title, optional actions slot, content, optional footer.
 * Reference: Vuetify Card (containment). Built from AtCard, AtButton.
 */
const props = defineProps<{
  title?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <AtCard :class="cn(props.class)">
    <AtCardHeader class="flex flex-row items-center justify-between space-y-0">
      <AtCardTitle v-if="title || $slots.title">
        <template v-if="title">{{ title }}</template>
        <slot v-else name="title" />
      </AtCardTitle>
      <div v-if="$slots.actions" class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </AtCardHeader>
    <AtCardContent>
      <slot />
    </AtCardContent>
    <AtCardFooter v-if="$slots.footer">
      <slot name="footer" />
    </AtCardFooter>
  </AtCard>
</template>
