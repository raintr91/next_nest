<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
/**
 * InfiniteScroll – emits load when user scrolls near bottom. Ref: Vuetify Infinite scroll.
 */
const emit = defineEmits<{ (e: 'load', done: (status: 'ok' | 'error' | 'empty' | 'loading') => void): void }>()
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!sentinel.value) return
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) return
      emit('load', (_status) => {})
    },
    { rootMargin: '100px', threshold: 0 }
  )
  observer.observe(sentinel.value)
})
onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <slot />
    <div ref="sentinel" class="h-2 w-full" aria-hidden="true" />
  </div>
</template>
