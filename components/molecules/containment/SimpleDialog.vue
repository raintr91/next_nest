<script setup lang="ts">
/**
 * SimpleDialog – dialog with title and slot (no confirm/cancel). Ref: Vuetify Dialog.
 */
const props = defineProps<{ open?: boolean; title?: string }>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ props.title }}</DialogTitle>
      </DialogHeader>
      <slot />
    </DialogContent>
  </Dialog>
</template>
