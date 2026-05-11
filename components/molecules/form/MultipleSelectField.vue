<script setup lang="ts">
import { getDisplayText, toggleSelection } from '~/components/molecules/form/multipleSelectFieldLogic'
const model = defineModel<string[]>({ type: Array, default: () => [] })
const open = ref(false)
const props = defineProps<{
  label?: string
  name?: string
  placeholder?: string
  options: { value: string; label: string }[]
}>()
const displayText = computed(() =>
  getDisplayText(model.value, props.options, props.placeholder ?? 'Select...')
)
function toggle(v: string, checked: boolean) {
  model.value = toggleSelection(model.value, v, checked)
}
</script>

<template>
  <MoFormField v-if="props.label" :label="props.label" :name="props.name">
    <AtPopover v-model:open="open">
      <AtPopoverTrigger>
        <AtButton variant="outline" class="w-full justify-start text-left font-normal">
          {{ displayText }}
        </AtButton>
      </AtPopoverTrigger>
      <AtPopoverContent class="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <div class="max-h-60 overflow-auto p-1">
          <label
            v-for="opt in props.options"
            :key="opt.value"
            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
          >
            <AtCheckbox :checked="model.includes(opt.value)" @update:checked="(c) => toggle(opt.value, c)" />
            {{ opt.label }}
          </label>
        </div>
      </AtPopoverContent>
    </AtPopover>
  </MoFormField>
  <AtPopover v-else v-model:open="open">
    <AtPopoverTrigger>
      <AtButton variant="outline" class="w-full justify-start text-left font-normal">
        {{ displayText }}
      </AtButton>
    </AtPopoverTrigger>
    <AtPopoverContent class="w-[var(--radix-popover-trigger-width)] p-0" align="start">
      <div class="max-h-60 overflow-auto p-1">
        <label
          v-for="opt in props.options"
          :key="opt.value"
          class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
        >
          <AtCheckbox :checked="model.includes(opt.value)" @update:checked="(c) => toggle(opt.value, c)" />
          {{ opt.label }}
        </label>
      </div>
    </AtPopoverContent>
  </AtPopover>
</template>
