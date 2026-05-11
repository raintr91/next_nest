<script setup lang="ts">
/**
 * SimpleTable – table from columns + items (no sort/pagination). Ref: Vuetify Table.
 */
const props = defineProps<{
  columns: { key: string; label?: string }[]
  items: Record<string, unknown>[]
}>()
</script>

<template>
  <AtTable>
    <AtTableHeader>
      <AtTableRow>
        <AtTableHead v-for="col in props.columns" :key="col.key">{{ col.label ?? col.key }}</AtTableHead>
      </AtTableRow>
    </AtTableHeader>
    <AtTableBody>
      <AtTableRow v-for="(row, i) in props.items" :key="i">
        <AtTableCell v-for="col in props.columns" :key="col.key">
          <slot :name="`cell-${col.key}`" :item="row" :value="row[col.key]">
            {{ row[col.key] }}
          </slot>
        </AtTableCell>
      </AtTableRow>
    </AtTableBody>
  </AtTable>
</template>
