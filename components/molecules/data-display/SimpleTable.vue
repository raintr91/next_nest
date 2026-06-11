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
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead v-for="col in props.columns" :key="col.key">{{ col.label ?? col.key }}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(row, i) in props.items" :key="i">
        <TableCell v-for="col in props.columns" :key="col.key">
          <slot :name="`cell-${col.key}`" :item="row" :value="row[col.key]">
            {{ row[col.key] }}
          </slot>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
