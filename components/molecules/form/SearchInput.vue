<script setup lang="ts">
/**
 * SearchInput – input with search placeholder. Ref: Vuetify Autocomplete / text field.
 */
const model = defineModel<string>({ type: String, default: '' })
const props = defineProps<{ placeholder?: string; disabled?: boolean }>()
</script>

<template>
  <Input
    v-model="model"
    type="search"
    :placeholder="props.placeholder ?? 'Search...'"
    :disabled="props.disabled"
    class="max-w-sm"
  />
</template>
