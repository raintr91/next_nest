<script setup lang="ts">
/**
 * ComboboxField – select or type custom value. Ref: Vuetify Combobox.
 */
const model = defineModel<string>({ type: String, default: '' })
const open = ref(false)
const props = defineProps<{
  label?: string
  name?: string
  placeholder?: string
  options: { value: string; label: string }[]
}>()
const displayText = computed(() => {
  const o = props.options.find((x) => x.value === model.value)
  return o?.label ?? model.value
})
const filterFn = (items: unknown[], term: string) => {
  const t = term.toLowerCase()
  return props.options.filter((o) => o.label.toLowerCase().includes(t)).map((o) => o.value)
}
function onSelect(v: string) {
  model.value = v
  open.value = false
}
function onInputFromTrigger(v: string) {
  model.value = v
}
</script>

<template>
  <MoFormField v-if="props.label" :label="props.label" :name="props.name">
    <AtPopover v-model:open="open">
      <AtPopoverTrigger>
        <AtInput
          :model-value="displayText"
          :placeholder="props.placeholder ?? 'Type or select...'"
          class="w-full"
          @update:model-value="onInputFromTrigger"
          @focus="open = true"
        />
      </AtPopoverTrigger>
      <AtPopoverContent class="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <AtCommand :filter-function="filterFn" @update:model-value="onSelect">
          <AtCommandInput :placeholder="props.placeholder ?? 'Search...'" />
          <AtCommandList>
            <AtCommandEmpty>No results. Press Enter to use current text.</AtCommandEmpty>
            <AtCommandItem
              v-for="opt in props.options"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </AtCommandItem>
          </AtCommandList>
        </AtCommand>
      </AtPopoverContent>
    </AtPopover>
  </MoFormField>
  <AtPopover v-else v-model:open="open">
    <AtPopoverTrigger>
      <AtInput
        :model-value="displayText"
        :placeholder="props.placeholder ?? 'Type or select...'"
        class="w-full"
        @update:model-value="onInputFromTrigger"
        @focus="open = true"
      />
    </AtPopoverTrigger>
    <AtPopoverContent class="w-[var(--radix-popover-trigger-width)] p-0" align="start">
      <AtCommand :filter-function="filterFn" @update:model-value="onSelect">
        <AtCommandInput :placeholder="props.placeholder ?? 'Search...'" />
        <AtCommandList>
          <AtCommandEmpty>No results.</AtCommandEmpty>
          <AtCommandItem v-for="opt in props.options" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </AtCommandItem>
        </AtCommandList>
      </AtCommand>
    </AtPopoverContent>
  </AtPopover>
</template>
