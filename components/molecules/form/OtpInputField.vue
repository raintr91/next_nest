<script setup lang="ts">
const model = defineModel<string[]>({ type: Array, default: () => [] })
const props = withDefaults(defineProps<{ label?: string; name?: string; digits?: number }>(), { digits: 6 })
</script>

<template>
  <MoFormField v-if="props.label" :label="props.label" :name="props.name">
    <AtPinInput v-model="model" class="gap-1">
      <AtPinInputInput v-for="i in props.digits" :key="i" />
    </AtPinInput>
  </MoFormField>
  <AtPinInput v-else v-model="model" class="gap-1">
    <AtPinInputInput v-for="i in props.digits" :key="i" />
  </AtPinInput>
</template>
