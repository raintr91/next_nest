<script setup lang="ts">
import { computed } from 'vue'
/**
 * SliderField – single value slider with optional label. Ref: Vuetify Slider.
 */
const model = defineModel<number>({ type: Number, default: 0 })
const props = defineProps<{
  label?: string
  name?: string
  min?: number
  max?: number
  step?: number
}>()
const sliderValue = computed({
  get: () => [model.value],
  set: (v: number[]) => { model.value = v[0] ?? 0 }
})
</script>

<template>
  <MoFormField v-if="props.label" :label="props.label" :name="props.name">
    <AtSlider
      v-model="sliderValue"
      :min="props.min ?? 0"
      :max="props.max ?? 100"
      :step="props.step ?? 1"
    />
  </MoFormField>
  <AtSlider
    v-else
    v-model="sliderValue"
    :min="props.min ?? 0"
    :max="props.max ?? 100"
    :step="props.step ?? 1"
  />
</template>
