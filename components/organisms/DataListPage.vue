<script setup lang="ts">
import type { DataTableColumn } from '~/components/molecules/layout/useDataTableLogic'
import type { SearchFilterConfig } from '~/components/molecules/form/searchFilterTypes'

/**
 * DataListPage – search form (filters prop) + data table. Emit search(query) for parent to fetch.
 */
const props = defineProps<{
  title?: string
  filters: SearchFilterConfig[]
  columns: DataTableColumn[]
  items: Record<string, unknown>[]
  pageSize?: number
  searchKeys?: string[]
  pending?: boolean
}>()

const query = defineModel<Record<string, unknown>>('query', { type: Object, default: () => ({}) })
const emit = defineEmits<{ (e: 'search'): void; (e: 'reset'): void }>()
</script>

<template>
  <div class="space-y-4">
    <MoAppBar v-if="props.title" :title="props.title">
      <template v-if="$slots.actions" #actions>
        <slot name="actions" />
      </template>
    </MoAppBar>

    <div class="rounded-lg border bg-card p-4">
      <MoSearchForm
        v-model="query"
        :filters="props.filters"
        :pending="props.pending"
        @submit="emit('search')"
        @reset="emit('reset')"
      >
        <template v-if="$slots['extra-actions']" #extra-actions>
          <slot name="extra-actions" />
        </template>
      </MoSearchForm>
    </div>

    <MoDataTable
      :columns="props.columns"
      :items="props.items"
      :page-size="props.pageSize"
      :search-keys="props.searchKeys"
      :search-placeholder="false"
    >
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </MoDataTable>
  </div>
</template>
