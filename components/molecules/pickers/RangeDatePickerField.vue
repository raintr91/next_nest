<script setup lang="ts">
import { ref } from 'vue'
import { formatDateRange } from '~/components/molecules/pickers/rangeDatePickerFieldLogic'
/**
 * RangeDatePickerField – pick date range via RangeCalendar in popover. Ref: Vuetify Date picker range.
 */
const model = defineModel<{ start?: string; end?: string }>({ type: Object, default: () => ({}) })
const open = ref(false)
function displayText() {
  return formatDateRange(model.value)
}
</script>

<template>
  <AtPopover v-model:open="open">
    <AtPopoverTrigger>
      <AtButton variant="outline" class="w-full justify-start text-left font-normal">
        {{ displayText() }}
      </AtButton>
    </AtPopoverTrigger>
    <AtPopoverContent class="w-auto p-0" align="start">
      <AtRangeCalendar
        v-model="model"
        initial-focus
        @update:model-value="open = false"
      />
    </AtPopoverContent>
  </AtPopover>
</template>
