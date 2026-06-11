<script setup lang="ts">
const p = defineProps<{ label?: string }>()
</script>

<template>
  <Separator :label="p.label" class="my-2" />
</template>
