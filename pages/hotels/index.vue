<script setup lang="ts">
import { useChainHotelList } from '~/composables/chain-hotel/useChainHotelList'

definePageMeta({
  layout: 'dashboard'
})

const {  filters,
  columns,
  items,
  query,
  pending,
  total,
  load,
  onSearch,
  onReset,
  exportMonth,
  exportPending,
  exportOpenRateReport,
  loginAsStoreManager,
  perPage,
  onPerPageChange
} = useChainHotelList()

onMounted(load)
</script>

<template>
  <DataListPage
    :title="'Chain — danh sách hotel (施設一覧)'"
    test-id="chain-hotels-page"
    filter-test-id="chain-hotels-search-form"
    table-test-id="chain-hotels-table"
    toolbar-test-id="chain-hotels-toolbar"
    pagination-test-id="chain-hotels-pagination"
    total-test-id="chain-hotels-total-btn"
    :filters="filters"
    :columns="columns"
    :items="items"
    v-model:query="query"
    :pending="pending"
    :total="total ?? undefined"
    :total-label="'合計'"
    :page-size="perPage"
    @search="onSearch"
    @reset="onReset"
  >
    <template #above-toolbar>
      <div class="flex flex-wrap items-end justify-center gap-4 rounded-lg border bg-card p-4">
        <div class="space-y-1">
          <Label for="chain-hotels-export-month">開封率データ</Label>
          <Input
            id="chain-hotels-export-month"
            v-model="exportMonth"
            type="month"
            :test-id="'chain-hotels-export-month-input'"
          />
        </div>
        <Button
          variant="default"
          :disabled="exportPending"
          :test-id="'chain-hotels-export-report-btn'"
          @click="exportOpenRateReport"
        >
          ダウンロード
        </Button>
      </div>
    </template>
    <template #toolbar-end>
      <div class="flex flex-wrap items-center gap-2 text-sm text-foreground">
        <span>表示件数</span>
        <select
          v-model.number="perPage"
          class="h-9 rounded-md border border-input bg-background px-2 text-sm"
          data-testid="chain-hotels-per-page-select"
          @change="onPerPageChange"
        >
          <option :value="20">20</option>
          <option :value="40">40</option>
          <option :value="80">80</option>
          <option :value="100">100</option>
        </select>
        <span>件</span>
      </div>
    </template>
    <template #cell-managers="{ row, value }">
      <MoManagerHandoffPills
        :managers="value"
        :row="row"
        :test-id="'chain-hotels-cell-managers'"
        @login-as="loginAsStoreManager"
      />
    </template>
  </DataListPage>
</template>
