<script setup lang="ts">
import { ref } from 'vue'
/**
 * ConfirmEdit – inline value with edit/confirm/cancel. Ref: Vuetify Confirm edit.
 */
const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
const editing = ref(false)
const draft = ref(props.modelValue ?? '')
function start() {
  editing.value = true
  draft.value = props.modelValue ?? ''
}
function confirm() {
  emit('update:modelValue', draft.value)
  editing.value = false
}
function cancel() {
  draft.value = props.modelValue ?? ''
  editing.value = false
}
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <template v-if="editing">
      <Input v-model="draft" :placeholder="props.placeholder" class="h-8 w-48" @keydown.enter="confirm" @keydown.esc="cancel" />
      <Button size="sm" @click="confirm">OK</Button>
      <Button size="sm" variant="outline" @click="cancel">Cancel</Button>
    </template>
    <button v-else type="button" class="text-left underline decoration-dashed underline-offset-2" @click="start">
      <slot>{{ props.modelValue || props.placeholder || 'Edit' }}</slot>
    </button>
  </div>
</template>
