<script setup lang="ts">
withDefaults(defineProps<{
  pageTitle: string
  pageDescription?: string
}>(), {
  pageDescription: ''
})
</script>

<template>
  <div class="space-y-6">
    <section class="border-b border-[#eceff5] bg-white px-6 py-5">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 class="text-[28px] font-semibold tracking-[0.02em] text-[#525866]">{{ pageTitle }}</h1>
          <p v-if="pageDescription" class="mt-2 text-sm text-[#8a94a6]">{{ pageDescription }}</p>
        </div>

        <div v-if="$slots.pageActions" class="flex flex-wrap items-center gap-2">
          <slot name="pageActions" />
        </div>
      </div>
    </section>

    <slot />
  </div>
</template>
