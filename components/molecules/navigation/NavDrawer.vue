<script setup lang="ts">
const props = defineProps<{ open?: boolean; title?: string }>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()
</script>

<template>
  <Sheet :open="props.open" @update:open="emit('update:open', $event)">
    <SheetContent side="left" class="w-64">
      <SheetHeader v-if="props.title || $slots.title">
        <SheetTitle>{{ props.title }}</SheetTitle>
        <slot name="title" />
      </SheetHeader>
      <nav class="flex flex-col gap-1 p-4"><slot /></nav>
    </SheetContent>
  </Sheet>
</template>
