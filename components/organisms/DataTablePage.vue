<script setup lang="ts">
import type { DataTableColumn } from '~/components/molecules/layout/useDataTableLogic'
/**
 * DataTablePage – page with app bar title + data table (columns, items, search, pagination).
 */
const props = defineProps<{
  title?: string
  columns: DataTableColumn[]
  items: Record<string, unknown>[]
  searchPlaceholder?: string
  pageSize?: number
  searchKeys?: string[]
}>()
</script>

<template>
  <div class="space-y-4">
    <MoAppBar v-if="props.title" :title="props.title">
      <template v-if="$slots.actions" #actions>
        <slot name="actions" />
      </template>
    </MoAppBar>
    <MoDataTable
      :columns="props.columns"
      :items="props.items"
      :search-placeholder="props.searchPlaceholder"
      :page-size="props.pageSize"
      :search-keys="props.searchKeys"
    />
  </div>
</template>
