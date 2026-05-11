<script setup lang="ts">
const p = defineProps<{ label?: string }>()
</script>

<template>
  <AtSeparator :label="p.label" class="my-2" />
</template>
