<script setup lang="ts">
import { computed } from 'vue'
/**
 * ProgressBar – linear progress with optional label. Ref: Vuetify Progress linear.
 */
const props = defineProps<{
  modelValue?: number
  label?: string
  showValue?: boolean
}>()
const pct = computed(() => Math.round((props.modelValue ?? 0) * 100))
</script>

<template>
  <div class="space-y-1">
    <div v-if="props.label || props.showValue" class="flex justify-between text-sm">
      <span v-if="props.label">{{ props.label }}</span>
      <span v-if="props.showValue" class="text-muted-foreground">{{ pct }}%</span>
    </div>
    <AtProgress :model-value="props.modelValue ?? 0" />
  </div>
</template>
