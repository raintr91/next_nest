<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils/cn'

/**
 * FormField – label + default slot (input) + optional error message.
 * Reference: Vuetify Text field / Form (form inputs). Built from AtLabel, AtFormItem, AtFormControl, AtFormMessage.
 */
const props = defineProps<{
  label?: string
  name?: string
  error?: string
  required?: boolean
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <AtFormItem :class="cn(props.class)">
    <AtFormLabel v-if="label" :for="name">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </AtFormLabel>
    <AtFormControl>
      <slot />
    </AtFormControl>
    <AtFormMessage v-if="error" class="text-destructive">
      {{ error }}
    </AtFormMessage>
    <slot name="hint" />
  </AtFormItem>
</template>
