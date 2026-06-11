<script setup lang="ts">
/**
 * BottomSheet – sheet that slides from bottom. Ref: Vuetify Bottom sheet.
 * Built from Sheet, SheetContent (side=bottom).
 */
const props = defineProps<{
  open?: boolean
  title?: string
}>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()
</script>

<template>
  <Sheet :open="props.open" @update:open="emit('update:open', $event)">
    <SheetContent side="bottom" class="rounded-t-xl">
      <SheetHeader v-if="title || $slots.title">
        <SheetTitle>{{ title }}</SheetTitle>
        <slot name="title" />
      </SheetHeader>
      <slot />
    </SheetContent>
  </Sheet>
</template>
