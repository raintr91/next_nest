<script setup lang="ts">
import type { DataTableColumn } from '~/components/molecules/layout/useDataTableLogic'
import { useDataResourceTable } from '~/composables/data/useDataResourceTable'

const props = withDefaults(defineProps<{
  title: string
  endpoint: string
  columns: DataTableColumn[]
  requestPath?: string
  method?: 'GET' | 'POST'
  searchPlaceholder?: string
}>(), {
  requestPath: undefined,
  method: 'POST',
  searchPlaceholder: 'Search...'
})

const { pending, errorMsg, items, totalRecords, fetchItems } = useDataResourceTable({
  title: props.title,
  endpoint: props.endpoint,
  requestPath: props.requestPath,
  method: props.method
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-sm text-muted-foreground">
        {{ pending ? 'Loading data...' : `${totalRecords ?? items.length} records` }}
      </h2>
      <Button variant="outline" size="sm" :disabled="pending" @click="fetchItems">
        Reload
      </Button>
    </div>

    <div
      v-if="errorMsg"
      class="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
    >
      {{ errorMsg }}
    </div>

    <DataTablePage
      :title="title"
      :columns="columns"
      :items="items"
      :search-placeholder="searchPlaceholder"
      :page-size="10"
    />
  </div>
</template>
