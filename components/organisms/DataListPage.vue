<script setup lang="ts">
import type { DataTableColumn } from '~/components/molecules/layout/useDataTableLogic'
import type { SearchFilterConfig } from '~/components/molecules/form/searchFilterTypes'

/**
 * DataListPage – search form (filters prop) + data table. Emit search(query) for parent to fetch.
 */
const props = defineProps<{
  title?: string
  testId?: string
  filterTestId?: string
  tableTestId?: string
  dataTableTestId?: string
  rowTestId?: string
  searchSubmitTestId?: string
  searchResetTestId?: string
  toolbarTestId?: string
  total?: number
  totalLabel?: string
  totalTestId?: string
  paginationTestId?: string
  filters: SearchFilterConfig[]
  columns: DataTableColumn[]
  items: Record<string, unknown>[]
  pageSize?: number
  searchKeys?: string[]
  pending?: boolean
}>()

const slots = useSlots()
const tableSlotNames = computed(() => Object.keys(slots).filter((name) => name.startsWith('cell-')))
const query = defineModel<Record<string, unknown>>('query', { type: Object, default: () => ({}) })
const emit = defineEmits<{ (e: 'search' | 'reset'): void }>()
</script>

<template>
  <div class="space-y-4" :data-testid="props.testId">
    <MoAppBar v-if="props.title" :title="props.title">
      <template v-if="$slots.actions" #actions>
        <slot name="actions" />
      </template>
    </MoAppBar>

    <div class="rounded-lg border bg-card p-4" :data-testid="props.filterTestId">
      <MoSearchForm
        v-model="query"
        :filters="props.filters"
        :pending="props.pending"
        :submit-test-id="props.searchSubmitTestId"
        :reset-test-id="props.searchResetTestId"
        @submit="emit('search')"
        @reset="emit('reset')"
      />
    </div>

    <div
      v-if="$slots['extra-actions'] || $slots['toolbar-end'] || props.total !== undefined"
      class="flex flex-wrap items-center justify-between gap-3"
      :data-testid="props.toolbarTestId ?? 'data-list-toolbar-actions'"
    >
      <div class="flex flex-wrap items-center gap-3">
        <button
          v-if="props.total !== undefined"
          type="button"
          class="pointer-events-none min-w-[120px] rounded-[5px] bg-[#48b0f7] px-4 py-2 text-sm font-semibold text-white shadow-none"
          aria-disabled="true"
          :data-testid="props.totalTestId"
        >
          {{ props.totalLabel ?? '合計' }} {{ props.total }}
        </button>
        <slot name="extra-actions" />
      </div>
      <div v-if="$slots['toolbar-end']" class="flex flex-wrap items-center gap-2">
        <slot name="toolbar-end" />
      </div>
    </div>

    <div :data-testid="props.tableTestId">
      <MoDataTable
        :columns="props.columns"
        :items="props.items"
        :page-size="props.pageSize"
        :search-keys="props.searchKeys"
        :search-placeholder="false"
        :row-test-id="props.rowTestId"
        :pagination-test-id="props.paginationTestId"
        :data-testid="props.dataTableTestId"
      >
        <template v-for="name in tableSlotNames" :key="name" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </MoDataTable>
    </div>

    <slot name="below" />
  </div>
</template>
