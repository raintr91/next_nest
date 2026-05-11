<script setup lang="ts">
/**
 * TimePickerField – time input (native or wrapped). Ref: Vuetify Time picker.
 */
const model = defineModel<string>({ type: String, default: '' })
const props = defineProps<{ label?: string; name?: string }>()
</script>

<template>
  <MoFormField v-if="props.label" :label="props.label" :name="props.name">
    <AtInput v-model="model" type="time" />
  </MoFormField>
  <AtInput v-else v-model="model" type="time" />
</template>
