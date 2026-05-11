<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import type { Span } from '~/components/molecules/layout/colLayout'
import { getColClasses } from '~/components/molecules/layout/colLayout'

/**
 * Col – column in 12-column grid with responsive spans.
 * Reference: Vuetify v-col (https://vuetifyjs.com/en/components/grids/)
 * Logic tested in tests/unit/molecules/layout/colLayout.test.ts
 */
const props = withDefaults(
  defineProps<{
    cols?: Span
    sm?: Span
    md?: Span
    lg?: Span
    xl?: Span
    offset?: number
    class?: HTMLAttributes['class']
  }>(),
  { cols: 12 }
)

const colClasses = computed(() => getColClasses(props))
</script>

<template>
  <div :class="colClasses">
    <slot />
  </div>
</template>
