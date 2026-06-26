<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { DataTableColumn } from '~/components/molecules/layout/useDataTableLogic'
import { cn } from '~/utils/cn'
import { cellValue } from '~/components/molecules/layout/dataTableLogic'
import { useDataTableLogic } from '~/components/molecules/layout/useDataTableLogic'

/**
 * DataTable – table with sorting, search, pagination.
 * Reference: Vuetify v-data-table (https://vuetifyjs.com/en/components/data-tables/introduction/)
 * Built from atoms: Table, Input, Button.
 * Logic tested in tests/unit/molecules/layout/dataTableLogic.test.ts
 */

export type { DataTableColumn } from '~/components/molecules/layout/useDataTableLogic'

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn[]
    items: Record<string, unknown>[]
    searchPlaceholder?: string | false
    pageSize?: number
    searchKeys?: string[]
    rowTestId?: string
    paginationTestId?: string
    class?: HTMLAttributes['class']
  }>(),
  {
    searchPlaceholder: '検索...',
    pageSize: 10,
    searchKeys: undefined,
    rowTestId: undefined,
    paginationTestId: undefined,
    class: undefined
  }
)

const {
  search,
  sortKey,
  sortOrder,
  page,
  totalPages,
  paginatedItems,
  toggleSort
} = useDataTableLogic(props)

function alignClass(align?: DataTableColumn['align']) {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

function overflowClass(overflow: DataTableColumn['overflow'] = 'truncate-tooltip') {
  if (overflow === 'nowrap') return 'whitespace-nowrap'
  if (overflow === 'wrap-2-lines') return 'line-clamp-2 whitespace-normal'
  if (overflow === 'wrap-free') return 'whitespace-normal'
  return 'max-w-[220px] truncate whitespace-nowrap'
}

function cellTitle(value: unknown, overflow: DataTableColumn['overflow'] = 'truncate-tooltip') {
  if (overflow === 'truncate-tooltip' || overflow === 'nowrap') return String(value ?? '')
  return undefined
}

function cellStyle(col: DataTableColumn) {
  return col.maxWidth ? { maxWidth: col.maxWidth } : undefined
}
</script>

<template>
  <div :class="cn('space-y-4', props.class)">
    <div v-if="props.searchPlaceholder !== false" class="flex justify-end">
      <Input
        v-model="search"
        type="search"
        :placeholder="props.searchPlaceholder"
        class="max-w-xs"
      />
    </div>
    <div class="overflow-x-auto rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              v-for="col in props.columns"
              :key="col.key"
              :class="[
                'whitespace-nowrap bg-muted/40 px-3 py-2 text-xs font-semibold text-foreground',
                alignClass(col.align),
                col.sortable ? 'cursor-pointer select-none hover:bg-muted/60' : ''
              ]"
              @click="col.sortable ? toggleSort(col.key) : undefined"
            >
              <span class="flex items-center gap-1">
                {{ col.title }}
                <template v-if="col.sortable && sortKey === col.key">
                  <span v-if="sortOrder === 'asc'">↑</span>
                  <span v-else>↓</span>
                </template>
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(row, i) in paginatedItems"
            :key="i"
            class="hover:bg-muted/30"
            :data-testid="props.rowTestId"
          >
            <TableCell
              v-for="col in props.columns"
              :key="col.key"
              class="px-3 py-2 align-middle text-sm"
              :class="[alignClass(col.align), overflowClass(col.overflow)]"
              :style="cellStyle(col)"
              :title="cellTitle(cellValue(row, col.key), col.overflow)"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="cellValue(row, col.key)">
                {{ cellValue(row, col.key) }}
              </slot>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <MoPaginationBar
      v-if="totalPages > 1"
      :page="page"
      :total-pages="totalPages"
      :test-id="props.paginationTestId"
      @update:page="page = $event"
    />
    <slot name="below" />
  </div>
</template>
