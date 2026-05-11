<script setup lang="ts">
/**
 * ListPage – page with app bar + list group (slot items) + optional FAB.
 */
const props = defineProps<{ title?: string }>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <MoAppBar v-if="props.title" :title="props.title">
      <template v-if="$slots.actions" #actions>
        <slot name="actions" />
      </template>
    </MoAppBar>
    <MoListGroup class="flex-1">
      <slot />
    </MoListGroup>
    <slot name="fab" />
  </div>
</template>
