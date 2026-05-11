<script setup lang="ts">
import type { SearchFilterConfig } from '~/components/molecules/form/searchFilterTypes'
import { normalizeOptions } from '~/components/molecules/form/searchFilterTypes'

const props = defineProps<{
  filters: SearchFilterConfig[]
  pending?: boolean
}>()

const model = defineModel<Record<string, unknown>>({ type: Object, default: () => ({}) })
const emit = defineEmits<{ (e: 'submit'): void; (e: 'reset'): void }>()

function getValue(name: string) {
  return model.value[name] ?? (props.filters.find((f) => f.name === name)?.multiple ? [] : '')
}

function setValue(name: string, v: unknown) {
  model.value = { ...model.value, [name]: v }
}

function onSubmit() {
  emit('submit')
}

function emptyRange() {
  return { start: '', end: '' }
}

function onReset() {
  const next: Record<string, unknown> = {}
  for (const f of props.filters) {
    if (f.type === 'time_range' || f.type === 'datetime_range') {
      next[f.name] = emptyRange()
    } else {
      next[f.name] = f.multiple ? [] : (f.type === 'checkbox' && !f.data ? false : '')
    }
  }
  model.value = next
  emit('reset')
}

function opts(f: SearchFilterConfig) {
  return normalizeOptions(f.data)
}

function toggleMulti(name: string, value: string, checked: boolean) {
  const arr = (model.value[name] as string[]) ?? []
  if (checked) setValue(name, [...arr, value])
  else setValue(name, arr.filter((x) => x !== value))
}
</script>

<template>
  <form class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end" @submit.prevent="onSubmit">
    <template v-for="f in props.filters" :key="f.name">
      <!-- text -->
      <MoFormField v-if="f.type === 'text_field'" :label="f.label" class="w-full sm:max-w-[200px]">
        <AtInput
          :model-value="String(getValue(f.name) ?? '')"
          :placeholder="f.placeholder"
          @update:model-value="setValue(f.name, $event)"
        />
      </MoFormField>
      <!-- number -->
      <MoNumberInputField
        v-else-if="f.type === 'number_field'"
        :model-value="model[f.name] as number | undefined"
        :label="f.label"
        :placeholder="f.placeholder"
        class="w-full sm:max-w-[140px]"
        @update:model-value="setValue(f.name, $event)"
      />
      <!-- select single -->
      <MoFormField v-else-if="f.type === 'select' && !f.multiple" :label="f.label" class="w-full sm:max-w-[180px]">
        <AtSelect
          :model-value="String(getValue(f.name) ?? '')"
          @update:model-value="setValue(f.name, $event)"
        >
          <AtSelectTrigger class="w-full">
            <AtSelectValue :placeholder="f.placeholder ?? 'Chọn'" />
          </AtSelectTrigger>
          <AtSelectContent>
            <AtSelectItem v-for="o in opts(f)" :key="o.value" :value="o.value">
              {{ o.label }}
            </AtSelectItem>
          </AtSelectContent>
        </AtSelect>
      </MoFormField>
      <!-- select multiple -->
      <div v-else-if="f.type === 'select' && f.multiple" class="w-full sm:max-w-[200px]">
        <MoMultipleSelectField
          :model-value="((getValue(f.name) as string[]) ?? [])"
          :label="f.label"
          :options="opts(f)"
          :placeholder="f.placeholder"
          @update:model-value="setValue(f.name, $event)"
        />
      </div>
      <!-- autocomplete -->
      <div v-else-if="f.type === 'autocomplete'" class="w-full sm:max-w-[200px]">
        <MoAutocompleteField
          :model-value="String(getValue(f.name) ?? '')"
          :label="f.label"
          :options="opts(f)"
          :placeholder="f.placeholder"
          @update:model-value="setValue(f.name, $event)"
        />
      </div>
      <!-- checkbox single -->
      <MoFormField v-else-if="f.type === 'checkbox' && !f.data?.length" :label="f.label" class="flex flex-row items-center gap-2">
        <AtCheckbox
          :checked="!!model[f.name]"
          @update:checked="setValue(f.name, $event)"
        />
      </MoFormField>
      <!-- checkbox multi (from data) -->
      <div v-else-if="f.type === 'checkbox' && f.data?.length" class="flex flex-col gap-1">
        <span class="text-sm font-medium">{{ f.label }}</span>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="o in opts(f)"
            :key="o.value"
            class="flex cursor-pointer items-center gap-2 rounded border px-2 py-1 text-sm"
          >
            <AtCheckbox
              :checked="((model[f.name] as string[]) ?? []).includes(o.value)"
              @update:checked="toggleMulti(f.name, o.value, $event)"
            />
            {{ o.label }}
          </label>
        </div>
      </div>
      <!-- date -->
      <div v-else-if="f.type === 'date'" class="w-full sm:max-w-[180px]">
        <MoFormField :label="f.label">
          <MoDatePickerField
            :model-value="(model[f.name] as string) ?? undefined"
            @update:model-value="setValue(f.name, $event)"
          />
        </MoFormField>
      </div>
      <!-- time_range -->
      <div v-else-if="f.type === 'time_range'" class="w-full sm:max-w-[220px]">
        <MoTimeRangeField
          :model-value="(getValue(f.name) as { start: string; end: string }) ?? emptyRange()"
          :label="f.label"
          :format="f.format ?? 'h:m'"
          @update:model-value="setValue(f.name, $event)"
        />
      </div>
      <!-- datetime_range -->
      <div v-else-if="f.type === 'datetime_range'" class="w-full sm:max-w-[320px]">
        <MoDateTimeRangeField
          :model-value="(getValue(f.name) as { start: string; end: string }) ?? emptyRange()"
          :label-start="f.label"
          :time-format="f.timeFormat ?? 'h:m'"
          @update:model-value="setValue(f.name, $event)"
        />
      </div>
    </template>
    <div class="flex shrink-0 gap-2">
      <AtButton type="submit" :disabled="props.pending">Search</AtButton>
      <AtButton type="button" variant="outline" :disabled="props.pending" @click="onReset">Clear</AtButton>
      <slot name="extra-actions" />
    </div>
  </form>
</template>
