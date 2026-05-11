<script setup lang="ts">
/**
 * BottomSheet – sheet that slides from bottom. Ref: Vuetify Bottom sheet.
 * Built from AtSheet, AtSheetContent (side=bottom).
 */
const props = defineProps<{
  open?: boolean
  title?: string
}>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()
</script>

<template>
  <AtSheet :open="props.open" @update:open="emit('update:open', $event)">
    <AtSheetContent side="bottom" class="rounded-t-xl">
      <AtSheetHeader v-if="title || $slots.title">
        <AtSheetTitle>{{ title }}</AtSheetTitle>
        <slot name="title" />
      </AtSheetHeader>
      <slot />
    </AtSheetContent>
  </AtSheet>
</template>
