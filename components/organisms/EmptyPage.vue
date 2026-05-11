<script setup lang="ts">
/**
 * EmptyPage – centered empty state with optional action.
 */
const props = defineProps<{ title?: string; description?: string }>()
</script>

<template>
  <div class="flex min-h-[50vh] items-center justify-center p-8">
    <MoEmptyState :title="props.title" :description="props.description">
      <slot name="action" />
    </MoEmptyState>
  </div>
</template>
