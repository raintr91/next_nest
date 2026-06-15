<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils/cn'

/**
 * FormField – label + default slot (input) + optional error message.
 * Reference: Vuetify Text field / Form (form inputs). Built from Label, FormItem, FormControl, FormMessage.
 */
const props = defineProps<{
  label?: string
  name?: string
  error?: string
  required?: boolean
  class?: HTMLAttributes['class']
  /** Root test id; label → `{testId}-label`, error → `{testId}-error` */
  testId?: string
}>()
</script>

<template>
  <FormItem :class="cn(props.class)" :data-testid="testId ? `${testId}-wrapper` : undefined">
    <FormLabel v-if="label" :for="name" :data-testid="testId ? `${testId}-label` : undefined">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </FormLabel>
    <FormControl>
      <slot />
    </FormControl>
    <FormMessage v-if="error" class="text-destructive" :data-testid="testId ? `${testId}-error` : undefined">
      {{ error }}
    </FormMessage>
    <slot name="hint" />
  </FormItem>
</template>
