<script setup lang="ts">
import { ref } from 'vue'

/**
 * DatePickerField – input that opens calendar popover to pick date.
 * Reference: Vuetify Date picker (pickers). Built from Popover, Calendar, Button, Input.
 */
const model = defineModel<string | undefined>({ type: String })
const open = ref(false)

function formatDisplay(d: string | undefined) {
  if (!d) return ''
  try {
    const date = new Date(d)
    return date.toLocaleDateString()
  } catch {
    return d
  }
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger>
      <Button
        variant="outline"
        class="w-full justify-start text-left font-normal"
      >
        {{ formatDisplay(model) || 'Pick a date' }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar v-model="model" initial-focus @update:model-value="open = false" />
    </PopoverContent>
  </Popover>
</template>
