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
  <AtSheet :open="props.open" @update:open="emit('update:open', $event)">
    <AtSheetContent :side="props.side ?? 'right'" class="sm:max-w-md">
      <AtSheetHeader v-if="props.title || $slots.title">
        <AtSheetTitle>{{ props.title }}</AtSheetTitle>
        <slot name="title" />
      </AtSheetHeader>
      <slot />
    </AtSheetContent>
  </AtSheet>
</template>
