<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
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
    columns: import('./useDataTableLogic').DataTableColumn[]
    items: Record<string, unknown>[]
    searchPlaceholder?: string
    pageSize?: number
    searchKeys?: string[]
    class?: HTMLAttributes['class']
  }>(),
  { searchPlaceholder: 'Search...', pageSize: 10 }
)

const {
  search,
  sortKey,
  sortOrder,
  page,
  totalPages,
  sortedItems,
  paginatedItems,
  toggleSort,
  goPrev,
  goNext
} = useDataTableLogic(props)
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            v-for="col in props.columns"
            :key="col.key"
            :class="col.sortable ? 'cursor-pointer select-none hover:bg-muted/50' : ''"
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
        <TableRow v-for="(row, i) in paginatedItems" :key="i">
          <TableCell v-for="col in props.columns" :key="col.key">
            <slot :name="`cell-${col.key}`" :row="row" :value="cellValue(row, col.key)">
              {{ cellValue(row, col.key) }}
            </slot>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between px-2 py-1 text-sm text-muted-foreground"
    >
      <span>
        Page {{ page }} of {{ totalPages }} ({{ sortedItems.length }} items)
      </span>
      <div class="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="page <= 1"
          @click="goPrev"
        >
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="page >= totalPages"
          @click="goNext"
        >
          Next
        </Button>
      </div>
    </div>
    <slot name="below" />
  </div>
</template>
