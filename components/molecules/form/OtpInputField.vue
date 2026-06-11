<script setup lang="ts">
const model = defineModel<string[]>({ type: Array, default: () => [] })
const props = withDefaults(defineProps<{ label?: string; name?: string; digits?: number }>(), { digits: 6 })
</script>

<template>
  <MoFormField v-if="props.label" :label="props.label" :name="props.name">
    <PinInput v-model="model" class="gap-1">
      <PinInputInput v-for="i in props.digits" :key="i" />
    </PinInput>
  </MoFormField>
  <PinInput v-else v-model="model" class="gap-1">
    <PinInputInput v-for="i in props.digits" :key="i" />
  </PinInput>
</template>
