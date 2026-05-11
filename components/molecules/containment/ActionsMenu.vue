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
  <AtDropdownMenu>
    <AtDropdownMenuTrigger>
      <slot name="trigger" />
    </AtDropdownMenuTrigger>
    <AtDropdownMenuContent>
      <AtDropdownMenuItem
        v-for="(item, i) in props.items"
        :key="i"
        :disabled="item.disabled"
        @select="onSelect(item)"
      >
        {{ item.label }}
      </AtDropdownMenuItem>
    </AtDropdownMenuContent>
  </AtDropdownMenu>
</template>
