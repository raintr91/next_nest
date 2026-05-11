<script setup lang="ts">
import { ref, onMounted } from 'vue'

/**
 * LazyMount – render slot only after mount (client-only placeholder until then).
 * Reference: Vuetify Lazy / No SSR (miscellaneous). Logic only, no UI test.
 */
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <slot v-if="mounted" />
  <slot v-else name="placeholder" />
</template>
