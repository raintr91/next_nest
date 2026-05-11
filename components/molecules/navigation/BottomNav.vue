<script setup lang="ts">
/**
 * BottomNav – bottom bar with nav items (mobile-style). Ref: Vuetify Bottom navigation.
 */
const props = defineProps<{
  modelValue?: string
  items: { value: string; label: string }[]
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-40 flex border-t bg-background py-2"
    role="navigation"
  >
    <button
      v-for="item in props.items"
      :key="item.value"
      type="button"
      class="flex flex-1 flex-col items-center gap-0.5 text-xs transition-colors"
      :class="props.modelValue === item.value ? 'text-primary' : 'text-muted-foreground'"
      @click="emit('update:modelValue', item.value)"
    >
      <slot :name="`icon-${item.value}`" :item="item">
        <span class="h-5 w-5 rounded-full bg-muted" />
      </slot>
      <span>{{ item.label }}</span>
    </button>
  </nav>
</template>
