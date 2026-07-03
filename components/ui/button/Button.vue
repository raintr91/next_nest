<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import type { ButtonVariants } from "."
import { Primitive } from "reka-ui"
import { cn } from '~/lib/utils'
import { buttonVariants } from "."

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
  testId?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :data-testid="testId"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    @click="(event: MouseEvent) => emit('click', event)"
  >
    <slot />
  </Primitive>
</template>
