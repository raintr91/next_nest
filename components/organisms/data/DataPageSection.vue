<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: '',
  description: ''
})
</script>

<template>
  <section class="rounded-2xl border border-border bg-card p-6">
    <div v-if="title || description || $slots.actions" class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div v-if="title || description">
        <h2 v-if="title" class="text-lg font-semibold">{{ title }}</h2>
        <p v-if="description" class="mt-1 text-sm text-muted-foreground">{{ description }}</p>
      </div>

      <div v-if="$slots.actions" class="flex flex-wrap gap-2">
        <slot name="actions" />
      </div>
    </div>

    <slot />

    <div v-if="$slots.footer" class="mt-4">
      <slot name="footer" />
    </div>
  </section>
</template>
