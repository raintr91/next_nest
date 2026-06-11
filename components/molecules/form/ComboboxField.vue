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
    <Popover v-model:open="open">
      <PopoverTrigger>
        <Input
          :model-value="displayText"
          :placeholder="props.placeholder ?? 'Type or select...'"
          class="w-full"
          @update:model-value="onInputFromTrigger"
          @focus="open = true"
        />
      </PopoverTrigger>
      <PopoverContent class="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command :filter-function="filterFn" @update:model-value="onSelect">
          <CommandInput :placeholder="props.placeholder ?? 'Search...'" />
          <CommandList>
            <CommandEmpty>No results. Press Enter to use current text.</CommandEmpty>
            <CommandItem
              v-for="opt in props.options"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </MoFormField>
  <Popover v-else v-model:open="open">
    <PopoverTrigger>
      <Input
        :model-value="displayText"
        :placeholder="props.placeholder ?? 'Type or select...'"
        class="w-full"
        @update:model-value="onInputFromTrigger"
        @focus="open = true"
      />
    </PopoverTrigger>
    <PopoverContent class="w-[var(--radix-popover-trigger-width)] p-0" align="start">
      <Command :filter-function="filterFn" @update:model-value="onSelect">
        <CommandInput :placeholder="props.placeholder ?? 'Search...'" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandItem v-for="opt in props.options" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </CommandItem>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
