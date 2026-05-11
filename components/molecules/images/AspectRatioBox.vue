<script setup lang="ts">
/**
 * AspectRatioBox – content with fixed aspect ratio. Ref: Vuetify Aspect ratio.
 */
const props = defineProps<{ ratio?: number }>()
</script>

<template>
  <AtAspectRatio :ratio="props.ratio ?? 16 / 9">
    <slot />
  </AtAspectRatio>
</template>
