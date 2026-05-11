<script setup lang="ts">
const props = defineProps<{ title?: string; subtitle?: string }>()
</script>

<template>
  <div class="flex items-center gap-3 px-4 py-3 text-left text-sm">
    <div v-if="$slots.leading" class="shrink-0"><slot name="leading" /></div>
    <div class="min-w-0 flex-1">
      <div v-if="props.title || $slots.title" class="font-medium">
        <template v-if="props.title">{{ props.title }}</template>
        <slot v-else name="title" />
      </div>
      <div v-if="props.subtitle || $slots.subtitle" class="text-muted-foreground text-xs">
        <template v-if="props.subtitle">{{ props.subtitle }}</template>
        <slot v-else name="subtitle" />
      </div>
    </div>
    <div v-if="$slots.trailing" class="shrink-0"><slot name="trailing" /></div>
  </div>
</template>
