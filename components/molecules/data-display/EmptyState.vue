<script setup lang="ts">
const props = defineProps<{ title?: string; description?: string }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-muted-foreground">
    <slot name="icon" />
    <h3 v-if="props.title" class="mt-2 text-lg font-semibold text-foreground">{{ props.title }}</h3>
    <p v-if="props.description" class="mt-1 text-sm">{{ props.description }}</p>
    <div v-if="$slots.default" class="mt-4"><slot /></div>
  </div>
</template>
