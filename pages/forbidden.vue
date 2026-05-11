<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-white px-6">
    <div class="text-center">
      <h1 class="text-3xl font-semibold mb-2">403</h1>
      <p class="text-gray-600 mb-6">Forbidden.</p>
      <NuxtLink to="/" class="text-blue-600 underline">Back to home</NuxtLink>
    </div>
  </div>
</template>
