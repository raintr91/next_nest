<script setup lang="ts">
type Column = {
  key: string
  label: string
  thClass?: string
  tdClass?: string
}

const props = withDefaults(defineProps<{
  columns: Column[]
  items: Record<string, unknown>[]
  loading?: boolean
  loadingText?: string
  emptyText?: string
  tableId?: string
  tableClass?: string
  rowKey?: string
}>(), {
  loading: false,
  loadingText: '読み込み中...',
  emptyText: '該当データがありません。',
  tableId: 'tableWithSearch',
  tableClass: 'table table-hover table-striped',
  rowKey: 'id'
})

function keyForRow(row: Record<string, unknown>, index: number) {
  const v = row[props.rowKey]
  if (typeof v === 'string' || typeof v === 'number') return String(v)
  return `row-${index}`
}
</script>

<template>
  <div class="table-responsive">
    <table :id="tableId" :class="tableClass">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="col.thClass"
          >
            <slot :name="`head-${col.key}`" :column="col">
              {{ col.label }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length" class="text-center py-4">
            <slot name="loading">{{ loadingText }}</slot>
          </td>
        </tr>
        <tr v-else-if="!items.length">
          <td :colspan="columns.length" class="text-center py-4">
            <slot name="empty">{{ emptyText }}</slot>
          </td>
        </tr>
        <tr v-for="(row, index) in items" v-else :key="keyForRow(row, index)">
          <td
            v-for="col in columns"
            :key="col.key"
            :class="col.tdClass"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
