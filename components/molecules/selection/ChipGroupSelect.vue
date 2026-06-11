<script setup lang="ts">
/**
 * ChipGroupSelect – single/multi select as chips. Ref: Vuetify Chip group.
 */
const props = defineProps<{
  modelValue?: string | string[]
  options: { value: string; label: string }[]
  multiple?: boolean
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string | string[]): void }>()
</script>

<template>
  <ToggleGroup
    :model-value="props.modelValue"
    :type="multiple ? 'multiple' : 'single'"
    class="flex flex-wrap gap-2"
    @update:model-value="(v) => emit('update:modelValue', v ?? (multiple ? [] : ''))"
  >
    <ToggleGroupItem
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
      class="rounded-full border px-3 py-1 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
    >
      {{ opt.label }}
    </ToggleGroupItem>
  </ToggleGroup>
</template>
