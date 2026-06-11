<script setup lang="ts">
/**
 * CarouselSlides – carousel from slides array with prev/next. Ref: Vuetify Carousel.
 */
const props = defineProps<{
  slides?: { id: string; content?: string }[]
}>()
</script>

<template>
  <Carousel>
    <CarouselContent>
      <template v-if="props.slides?.length">
        <CarouselItem v-for="s in props.slides" :key="s.id">
          <slot :name="s.id" :slide="s">{{ s.content }}</slot>
        </CarouselItem>
      </template>
      <template v-else>
        <slot />
      </template>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>
