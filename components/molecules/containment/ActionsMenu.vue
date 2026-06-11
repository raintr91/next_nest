<script setup lang="ts">
/**
 * ActionsMenu – dropdown menu with trigger and list of actions. Ref: Vuetify Menu.
 */
const props = defineProps<{
  items: { label: string; disabled?: boolean; onClick?: () => void }[]
}>()
const emit = defineEmits<{ (e: 'select', item: { label: string }): void }>()
function onSelect(item: (typeof props.items)[0]) {
  item.onClick?.()
  emit('select', { label: item.label })
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem
        v-for="(item, i) in props.items"
        :key="i"
        :disabled="item.disabled"
        @select="onSelect(item)"
      >
        {{ item.label }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
