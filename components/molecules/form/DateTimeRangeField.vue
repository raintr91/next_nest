<script setup lang="ts">
import type { TimeRangeFormat } from '~/components/molecules/form/timeRangeLogic'
import { splitDateTime, joinDateTime, pad2 } from '~/components/molecules/form/timeRangeLogic'

const model = defineModel<{ start: string; end: string }>({
  type: Object,
  default: () => ({ start: '', end: '' })
})

const props = withDefaults(
  defineProps<{
    labelStart?: string
    labelEnd?: string
    timeFormat?: TimeRangeFormat
  }>(),
  { labelStart: 'Từ', labelEnd: 'Đến', timeFormat: 'h:m' }
)

const startParts = computed(() => splitDateTime(model.value?.start))
const endParts = computed(() => splitDateTime(model.value?.end))

const startDate = computed({
  get: () => startParts.value.date,
  set: (v: string) => {
    model.value = {
      ...model.value,
      start: joinDateTime(v, startParts.value.time)
    }
  }
})
function toTimeString(v: string): string {
  if (props.timeFormat === 'h') {
    const h = Math.min(23, Math.max(0, parseInt(v, 10) || 0))
    return `${pad2(h)}:00:00`
  }
  return v || '00:00'
}
const startTime = computed({
  get: () => startParts.value.time.slice(0, props.timeFormat === 'h' ? 2 : props.timeFormat === 'h:m' ? 5 : 8),
  set: (v: string) => {
    model.value = {
      ...model.value,
      start: joinDateTime(startParts.value.date, toTimeString(v))
    }
  }
})
const endDate = computed({
  get: () => endParts.value.date,
  set: (v: string) => {
    model.value = {
      ...model.value,
      end: joinDateTime(v, endParts.value.time)
    }
  }
})
const endTime = computed({
  get: () => endParts.value.time.slice(0, props.timeFormat === 'h' ? 2 : props.timeFormat === 'h:m' ? 5 : 8),
  set: (v: string) => {
    const t = v ? (props.timeFormat === 'h' ? `${pad2(Math.min(23, Math.max(0, parseInt(v, 10) || 0)))}:00:00` : v) : '23:59'
    model.value = { ...model.value, end: joinDateTime(endParts.value.date, t) }
  }
})

const timeStep = computed(() => (props.timeFormat === 'h' ? 3600 : props.timeFormat === 'h:m' ? 60 : 1))
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <span v-if="props.labelStart" class="text-sm font-medium">{{ props.labelStart }}</span>
        <div class="flex flex-wrap gap-2">
          <MoDatePickerField
            :model-value="startDate"
            @update:model-value="startDate = $event ?? ''"
          />
          <AtInput
            v-if="timeFormat === 'h'"
            type="number"
            min="0"
            max="23"
            :model-value="startTime"
            class="w-20"
            @update:model-value="startTime = $event"
          />
          <AtInput
            v-else
            type="time"
            :step="timeStep"
            :model-value="startTime"
            class="w-32"
            @update:model-value="startTime = $event"
          />
        </div>
      </div>
      <div class="space-y-2">
        <span v-if="props.labelEnd" class="text-sm font-medium">{{ props.labelEnd }}</span>
        <div class="flex flex-wrap gap-2">
          <MoDatePickerField
            :model-value="endDate"
            @update:model-value="endDate = $event ?? ''"
          />
          <AtInput
            v-if="timeFormat === 'h'"
            type="number"
            min="0"
            max="23"
            :model-value="endTime"
            class="w-20"
            @update:model-value="endTime = $event"
          />
          <AtInput
            v-else
            type="time"
            :step="timeStep"
            :model-value="endTime"
            class="w-32"
            @update:model-value="endTime = $event"
          />
        </div>
      </div>
    </div>
  </div>
</template>
