<script setup lang="ts">
import { computed } from 'vue'
/**
 * NumberInputField – FormField + number input. Ref: Vuetify Number input.
 */
const model = defineModel<number | undefined>({ type: Number })
const props = defineProps<{
  label?: string
  name?: string
  error?: string
  min?: number
  max?: number
  step?: number
}>()
const inputStr = computed({
  get: () => (model.value === undefined || model.value === null ? '' : String(model.value)),
  set: (v) => { model.value = v === '' ? undefined : Number(v) }
})
</script>

<template>
  <MoFormField :label="props.label" :name="props.name" :error="props.error">
    <AtInput
      v-model="inputStr"
      type="number"
      :min="props.min"
      :max="props.max"
      :step="props.step"
    />
  </MoFormField>
</template>
