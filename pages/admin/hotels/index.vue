<script setup lang="ts">
import { useHotelList } from '~/composables/hotel/useHotelList'

const {
  filters,
  columns,
  items,
  query,
  pending,
  total,
  load,
  onSearch,
  onReset
} = useHotelList()

onMounted(load)
</script>

<template>
  <DataListPage
    :title="'Admin hotel list'"
    test-id="hotels-page"
    filter-test-id="hotels-search-form"
    table-test-id="hotels-table"
    toolbar-test-id="hotels-toolbar"
    pagination-test-id="hotels-pagination"
    :filters="filters"
    :columns="columns"
    :items="items"
    v-model:query="query"
    :pending="pending"
    :total="total ?? undefined"
    :page-size="10"
    @search="onSearch"
    @reset="onReset"
  >
    <template #cell-status="{ row, value }">
      <MoStatusChip
        :label="String(value ?? '')"
        :test-id="'hotels-cell-status'"
      />
    </template>
  </DataListPage>
</template>
