<script setup lang="ts">
defineProps<{
  message?: string | null
}>()
</script>

<template>
  <div v-if="message" class="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
    {{ message }}
  </div>
</template>
