<script setup lang="ts">
/**
 * SideSheet – sheet from left or right. Ref: Vuetify Sheet (drawer style).
 */
const props = defineProps<{
  open?: boolean
  title?: string
  side?: 'left' | 'right'
}>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()
</script>

<template>
  <Sheet :open="props.open" @update:open="emit('update:open', $event)">
    <SheetContent :side="props.side ?? 'right'" class="sm:max-w-md">
      <SheetHeader v-if="props.title || $slots.title">
        <SheetTitle>{{ props.title }}</SheetTitle>
        <slot name="title" />
      </SheetHeader>
      <slot />
    </SheetContent>
  </Sheet>
</template>
