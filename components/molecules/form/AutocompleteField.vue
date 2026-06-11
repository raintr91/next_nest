<script setup lang="ts">
import { getDisplayText } from '~/components/molecules/form/autocompleteFieldLogic'
const model = defineModel<string>({ type: String, default: '' })
const open = ref(false)
const props = defineProps<{ label?: string; name?: string; placeholder?: string; options: { value: string; label: string }[] }>()
const displayText = computed(() => getDisplayText(model.value, props.options))
function onSelect(v: string) {
  model.value = v
  open.value = false
}
</script>

<template>
  <MoFormField v-if="props.label" :label="props.label" :name="props.name">
    <Popover v-model:open="open">
      <PopoverTrigger>
        <Button variant="outline" class="w-full justify-start text-left font-normal">
          {{ displayText || props.placeholder || 'Select...' }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command @update:model-value="onSelect">
          <CommandInput :placeholder="props.placeholder ?? 'Search...'" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandItem v-for="opt in props.options" :key="opt.value" :value="opt.value">{{ opt.label }}</CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </MoFormField>
  <Popover v-else v-model:open="open">
    <PopoverTrigger>
      <Button variant="outline" class="w-full justify-start text-left font-normal">
        {{ displayText || props.placeholder || 'Select...' }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[var(--radix-popover-trigger-width)] p-0" align="start">
      <Command @update:model-value="onSelect">
        <CommandInput :placeholder="props.placeholder ?? 'Search...'" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandItem v-for="opt in props.options" :key="opt.value" :value="opt.value">{{ opt.label }}</CommandItem>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
