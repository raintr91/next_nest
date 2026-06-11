<script setup lang="ts">
import { ref } from 'vue'

/**
 * SpeedDial – FAB that expands to show actions. Ref: Vuetify Speed dials.
 */
const props = defineProps<{
  actions?: { label: string; onClick?: () => void }[]
}>()
const open = ref(false)
</script>

<template>
  <div class="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end gap-2">
    <template v-if="props.actions?.length">
      <div v-if="open" class="flex flex-col-reverse gap-2">
          <Button
            v-for="(a, i) in props.actions"
            :key="i"
            variant="outline"
            size="sm"
            class="rounded-full shadow"
            @click="a.onClick?.(); open = false"
          >
            {{ a.label }}
          </Button>
        </div>
    </template>
    <Button
      size="icon"
      class="h-12 w-12 rounded-full shadow-lg"
      :aria-expanded="open"
      @click="open = !open"
    >
      <slot name="icon" />
      <span v-if="!$slots.icon" aria-hidden="true">+</span>
    </Button>
  </div>
</template>
