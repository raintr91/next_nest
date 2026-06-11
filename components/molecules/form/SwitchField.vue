<script setup lang="ts">
/**
 * SwitchField – switch with optional label. Ref: Vuetify Switch.
 */
const model = defineModel<boolean>({ type: Boolean, default: false })
const props = defineProps<{ label?: string; name?: string }>()
</script>

<template>
  <MoFormField v-if="props.label" :label="props.label" :name="props.name" class="flex flex-row items-center justify-between gap-4">
    <template #default>
      <Switch v-model="model" />
    </template>
  </MoFormField>
  <Switch v-else v-model="model" />
</template>
