<script setup lang="ts">
import { computed } from 'vue'
/**
 * Window – show one panel by model value (slot per value). Ref: Vuetify Window.
 */
const props = defineProps<{ modelValue?: string; panels?: string[] }>()
const names = computed(() => props.panels ?? [])
</script>

<template>
  <div class="contents">
    <template v-for="name in names" :key="name">
      <div v-show="name === props.modelValue" class="contents">
        <slot :name="name" />
      </div>
    </template>
  </div>
</template>
