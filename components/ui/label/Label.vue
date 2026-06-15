<script setup lang="ts">
import type { LabelProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { Label } from "reka-ui"
import { cn } from '~/lib/utils'

const props = defineProps<LabelProps & {
  class?: HTMLAttributes["class"]
  /** Maps to `data-testid` — see docs/E2E-TESTIDS.md */
  testId?: string
}>()

const delegatedProps = reactiveOmit(props, "class", "testId")
</script>

<template>
  <Label
    v-bind="delegatedProps"
    :data-testid="testId"
    :class="
      cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        props.class,
      )
    "
  >
    <slot />
  </Label>
</template>
