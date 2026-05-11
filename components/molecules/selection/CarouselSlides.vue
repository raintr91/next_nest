<script setup lang="ts">
/**
 * CarouselSlides – carousel from slides array with prev/next. Ref: Vuetify Carousel.
 */
const props = defineProps<{
  slides?: { id: string; content?: string }[]
}>()
</script>

<template>
  <AtCarousel>
    <AtCarouselContent>
      <template v-if="props.slides?.length">
        <AtCarouselItem v-for="s in props.slides" :key="s.id">
          <slot :name="s.id" :slide="s">{{ s.content }}</slot>
        </AtCarouselItem>
      </template>
      <template v-else>
        <slot />
      </template>
    </AtCarouselContent>
    <AtCarouselPrevious />
    <AtCarouselNext />
  </AtCarousel>
</template>
