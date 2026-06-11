<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  options: { value: string; label: string }[]
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <ToggleGroup
    :model-value="modelValue"
    type="single"
    class="inline-flex rounded-md border p-1"
    @update:model-value="(v) => emit('update:modelValue', v ?? '')"
  >
    <ToggleGroupItem v-for="opt in options" :key="opt.value" :value="opt.value" class="rounded-sm px-3">
      {{ opt.label }}
    </ToggleGroupItem>
  </ToggleGroup>
</template>
