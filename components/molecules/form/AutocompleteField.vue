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
    <AtPopover v-model:open="open">
      <AtPopoverTrigger>
        <AtButton variant="outline" class="w-full justify-start text-left font-normal">
          {{ displayText || props.placeholder || 'Select...' }}
        </AtButton>
      </AtPopoverTrigger>
      <AtPopoverContent class="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <AtCommand @update:model-value="onSelect">
          <AtCommandInput :placeholder="props.placeholder ?? 'Search...'" />
          <AtCommandList>
            <AtCommandEmpty>No results.</AtCommandEmpty>
            <AtCommandItem v-for="opt in props.options" :key="opt.value" :value="opt.value">{{ opt.label }}</AtCommandItem>
          </AtCommandList>
        </AtCommand>
      </AtPopoverContent>
    </AtPopover>
  </MoFormField>
  <AtPopover v-else v-model:open="open">
    <AtPopoverTrigger>
      <AtButton variant="outline" class="w-full justify-start text-left font-normal">
        {{ displayText || props.placeholder || 'Select...' }}
      </AtButton>
    </AtPopoverTrigger>
    <AtPopoverContent class="w-[var(--radix-popover-trigger-width)] p-0" align="start">
      <AtCommand @update:model-value="onSelect">
        <AtCommandInput :placeholder="props.placeholder ?? 'Search...'" />
        <AtCommandList>
          <AtCommandEmpty>No results.</AtCommandEmpty>
          <AtCommandItem v-for="opt in props.options" :key="opt.value" :value="opt.value">{{ opt.label }}</AtCommandItem>
        </AtCommandList>
      </AtCommand>
    </AtPopoverContent>
  </AtPopover>
</template>
