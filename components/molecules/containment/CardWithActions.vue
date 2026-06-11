<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils/cn'

/**
 * CardWithActions – card with title, optional actions slot, content, optional footer.
 * Reference: Vuetify Card (containment). Built from Card, Button.
 */
const props = defineProps<{
  title?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Card :class="cn(props.class)">
    <CardHeader class="flex flex-row items-center justify-between space-y-0">
      <CardTitle v-if="title || $slots.title">
        <template v-if="title">{{ title }}</template>
        <slot v-else name="title" />
      </CardTitle>
      <div v-if="$slots.actions" class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </CardHeader>
    <CardContent>
      <slot />
    </CardContent>
    <CardFooter v-if="$slots.footer">
      <slot name="footer" />
    </CardFooter>
  </Card>
</template>
