<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  /** Page/module scope — maps to `data-testid` on root and `{testId}-title` */
  testId?: string
}>(), {
  description: ''
})
</script>

<template>
  <div class="rounded-2xl border border-border bg-card p-6" :data-testid="testId">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-2xl font-bold" :data-testid="testId ? `${testId}-title` : undefined">{{ title }}</h1>
        <p v-if="description" class="mt-1 text-sm text-muted-foreground" :data-testid="testId ? `${testId}-description` : undefined">{{ description }}</p>
      </div>

      <div v-if="$slots.actions" class="flex flex-wrap gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
