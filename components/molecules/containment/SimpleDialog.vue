<script setup lang="ts">
/**
 * SimpleDialog – dialog with title and slot (no confirm/cancel). Ref: Vuetify Dialog.
 */
const props = defineProps<{ open?: boolean; title?: string }>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()
</script>

<template>
  <AtDialog :open="props.open" @update:open="emit('update:open', $event)">
    <AtDialogContent class="sm:max-w-md">
      <AtDialogHeader>
        <AtDialogTitle>{{ props.title }}</AtDialogTitle>
      </AtDialogHeader>
      <slot />
    </AtDialogContent>
  </AtDialog>
</template>
