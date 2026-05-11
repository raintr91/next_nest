<script setup lang="ts">
import { ref } from 'vue'

/**
 * DatePickerField – input that opens calendar popover to pick date.
 * Reference: Vuetify Date picker (pickers). Built from AtPopover, AtCalendar, AtButton, AtInput.
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
  <AtPopover v-model:open="open">
    <AtPopoverTrigger>
      <AtButton
        variant="outline"
        class="w-full justify-start text-left font-normal"
      >
        {{ formatDisplay(model) || 'Pick a date' }}
      </AtButton>
    </AtPopoverTrigger>
    <AtPopoverContent class="w-auto p-0" align="start">
      <AtCalendar v-model="model" initial-focus @update:model-value="open = false" />
    </AtPopoverContent>
  </AtPopover>
</template>
