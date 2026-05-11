<script setup lang="ts">
/**
 * RangeSliderField – range slider (min–max). Ref: Vuetify Range slider.
 */
const model = defineModel<[number, number]>({ type: Array, default: () => [0, 100] })
const props = defineProps<{
  label?: string
  name?: string
  min?: number
  max?: number
  step?: number
}>()
const minVal = computed(() => props.min ?? 0)
const maxVal = computed(() => props.max ?? 100)
</script>

<template>
  <MoFormField v-if="props.label" :label="props.label" :name="props.name">
    <AtSlider
      v-model="model"
      :min="minVal"
      :max="maxVal"
      :step="props.step ?? 1"
    />
  </MoFormField>
  <AtSlider
    v-else
    v-model="model"
    :min="minVal"
    :max="maxVal"
    :step="props.step ?? 1"
  />
</template>
