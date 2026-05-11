<script setup lang="ts">
import type { TimeRangeFormat } from '~/components/molecules/form/timeRangeLogic'
import { parseTime, formatTime } from '~/components/molecules/form/timeRangeLogic'

const model = defineModel<{ start: string; end: string }>({
  type: Object,
  default: () => ({ start: '00:00', end: '23:59' })
})
const props = withDefaults(
  defineProps<{
    label?: string
    format?: TimeRangeFormat
  }>(),
  { format: 'h:m' }
)

const step = computed(() =>
  props.format === 'h' ? 3600 : props.format === 'h:m' ? 60 : 1
)

function timeDisplay(v: string): string {
  if (props.format === 'h') {
    const { h } = parseTime(v)
    return String(h)
  }
  return v || (props.format === 'h:m:s' ? '00:00:00' : '00:00')
}

function onStartInput(e: Event) {
  const el = e.target as HTMLInputElement
  if (props.format === 'h') {
    const h = Math.min(23, Math.max(0, parseInt(el.value, 10) || 0))
    model.value = { ...model.value, start: formatTime(h, 0, 0, 'h') }
  } else {
    model.value = { ...model.value, start: el.value || '00:00' }
  }
}

function onEndInput(e: Event) {
  const el = e.target as HTMLInputElement
  if (props.format === 'h') {
    const h = Math.min(23, Math.max(0, parseInt(el.value, 10) || 0))
    model.value = { ...model.value, end: formatTime(h, 0, 0, 'h') }
  } else {
    model.value = { ...model.value, end: el.value || '23:59' }
  }
}
</script>

<template>
  <MoFormField v-if="props.label" :label="props.label" class="space-y-2">
    <div class="flex flex-wrap items-center gap-2">
      <template v-if="props.format === 'h'">
        <AtInput
          type="number"
          min="0"
          max="23"
          :value="timeDisplay(model.start)"
          placeholder="0"
          class="w-20"
          @input="onStartInput"
        />
        <span class="text-muted-foreground">–</span>
        <AtInput
          type="number"
          min="0"
          max="23"
          :value="timeDisplay(model.end)"
          placeholder="23"
          class="w-20"
          @input="onEndInput"
        />
      </template>
      <template v-else>
        <AtInput
          type="time"
          :step="step"
          :value="model.start"
          class="w-32"
          @input="onStartInput"
        />
        <span class="text-muted-foreground">–</span>
        <AtInput
          type="time"
          :step="step"
          :value="model.end"
          class="w-32"
          @input="onEndInput"
        />
      </template>
    </div>
  </MoFormField>
  <div v-else class="flex flex-wrap items-center gap-2">
    <template v-if="props.format === 'h'">
      <AtInput
        type="number"
        min="0"
        max="23"
        :value="timeDisplay(model.start)"
        class="w-20"
        @input="onStartInput"
      />
      <span class="text-muted-foreground">–</span>
      <AtInput
        type="number"
        min="0"
        max="23"
        :value="timeDisplay(model.end)"
        class="w-20"
        @input="onEndInput"
      />
    </template>
    <template v-else>
      <AtInput type="time" :step="step" :value="model.start" class="w-32" @input="onStartInput" />
      <span class="text-muted-foreground">–</span>
      <AtInput type="time" :step="step" :value="model.end" class="w-32" @input="onEndInput" />
    </template>
  </div>
</template>
