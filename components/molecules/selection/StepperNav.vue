<script setup lang="ts">
import { computed } from 'vue'
/**
 * StepperNav – stepper from steps array. Ref: Vuetify Stepper.
 */
const props = defineProps<{
  steps: { id: string; label: string }[]
  modelValue?: number
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()
const current = computed(() => Math.max(0, Math.min(props.modelValue ?? 0, props.steps.length - 1)))
</script>

<template>
  <Stepper :model-value="current" @update:model-value="(v) => emit('update:modelValue', Number(v))">
    <template v-for="(step, i) in steps" :key="step.id">
      <StepperSeparator v-if="i > 0" />
      <StepperItem :step="i">
        <StepperTrigger>
          <StepperIndicator />
          <StepperTitle>{{ step.label }}</StepperTitle>
        </StepperTrigger>
      </StepperItem>
    </template>
  </Stepper>
</template>
