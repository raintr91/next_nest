<script setup lang="ts">
/**
 * NoSsr – render slot only on client. Ref: Vuetify No SSR.
 */
const mounted = ref(false)
onMounted(() => { mounted.value = true })
</script>

<template>
  <slot v-if="mounted" />
</template>
