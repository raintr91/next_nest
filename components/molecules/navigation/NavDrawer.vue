<script setup lang="ts">
const props = defineProps<{ open?: boolean; title?: string }>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()
</script>

<template>
  <AtSheet :open="props.open" @update:open="emit('update:open', $event)">
    <AtSheetContent side="left" class="w-64">
      <AtSheetHeader v-if="props.title || $slots.title">
        <AtSheetTitle>{{ props.title }}</AtSheetTitle>
        <slot name="title" />
      </AtSheetHeader>
      <nav class="flex flex-col gap-1 p-4"><slot /></nav>
    </AtSheetContent>
  </AtSheet>
</template>
