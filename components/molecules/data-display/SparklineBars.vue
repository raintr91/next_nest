<script setup lang="ts">
import { computed } from 'vue'
import { getSparklineMax } from '~/components/molecules/data-display/sparklineBarsLogic'
/**
 * SparklineBars – minimal sparkline as horizontal bars. Ref: Vuetify Sparkline.
 */
const props = defineProps<{
  data?: number[]
  height?: number
}>()
const values = computed(() => props.data ?? [])
const max = computed(() => getSparklineMax(values.value))
</script>

<template>
  <div class="flex items-end gap-0.5" :style="{ height: (props.height ?? 32) + 'px' }">
    <div
      v-for="(v, i) in values"
      :key="i"
      class="min-w-[2px] flex-1 rounded-sm bg-primary/70 transition-all"
      :style="{ height: (v / max) * 100 + '%' }"
    />
  </div>
</template>
