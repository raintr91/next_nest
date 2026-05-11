<script setup lang="ts">
const model = defineModel<FileList | undefined>()
const props = defineProps<{ label?: string; name?: string; accept?: string; multiple?: boolean }>()
function onInput(e: Event) {
  model.value = (e.target as HTMLInputElement).files ?? undefined
}
</script>

<template>
  <MoFormField v-if="props.label" :label="props.label" :name="props.name">
    <input type="file" :name="props.name" :accept="props.accept" :multiple="props.multiple" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-2 file:rounded file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground" @input="onInput" />
  </MoFormField>
  <input v-else type="file" :name="props.name" :accept="props.accept" :multiple="props.multiple" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-2 file:rounded file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground" @input="onInput" />
</template>
