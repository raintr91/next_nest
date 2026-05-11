<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: false
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <h1 class="text-2xl font-semibold mb-2">Portal Base</h1>
      <p class="text-gray-600">Auth-only base is ready.</p>
    </div>
  </div>
</template>
