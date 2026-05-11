<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
}>(), {})
</script>

<template>
  <section class="bg-white px-6 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
    <div v-if="title" class="mb-5">
      <h2 class="text-[18px] font-semibold text-[#5f6777]">{{ title }}</h2>
    </div>

    <div v-if="$slots.filters" class="rounded-sm border border-[#eef1f6] bg-[#fbfcfe] px-5 py-4">
      <slot name="filters" />
    </div>

    <div v-if="$slots.actions || $slots.summary" class="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div v-if="$slots.actions" class="flex flex-wrap items-center gap-3">
        <slot name="actions" />
      </div>

      <div v-if="$slots.summary" class="flex items-center justify-end text-sm text-[#7e8797]">
        <slot name="summary" />
      </div>
    </div>

    <div class="mt-4 overflow-hidden border border-[#eef1f6] bg-white">
      <div class="overflow-x-auto">
        <slot />
      </div>
    </div>
  </section>
</template>
