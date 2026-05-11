<script setup lang="ts">
/**
 * SkeletonCard – card-shaped skeleton placeholder. Ref: Vuetify Skeleton loader.
 */
</script>

<template>
  <div class="rounded-lg border bg-card p-4">
    <AtSkeleton class="mb-3 h-5 w-3/4" />
    <AtSkeleton class="mb-2 h-4 w-full" />
    <AtSkeleton class="mb-2 h-4 w-full" />
    <AtSkeleton class="h-4 w-1/2" />
  </div>
</template>
