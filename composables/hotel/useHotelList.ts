import type { SearchFilterConfig } from '~/components/molecules/form/searchFilterTypes'
import type { DataTableColumn } from '~/components/molecules/layout/useDataTableLogic'
import { createHotelService } from '~/services/hotel.service'
import { hotelMockSearch } from '~/mocks/hotel.mock'

/**
 * Admin hotel list — list composable (portal-gen).
 * Mock boundary: replace hotelMockSearch with service.search on /wire.
 */
export function useHotelList() {
  const { $apiFetch } = useNuxtApp()
  const service = createHotelService($apiFetch)

  const pending = ref(false)
  const errorMsg = ref<string | null>(null)
  const items = ref<Record<string, unknown>[]>([])
  const total = ref<number | null>(null)
  const query = ref<Record<string, unknown>>({})

  const filters = computed<SearchFilterConfig[]>(() => [
    {
      name: 'name',
      label: 'Hotel name',
      type: 'text_field',
      placeholder: 'Search by name'
    }
  ])

  const columns = computed<DataTableColumn[]>(() => [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      align: 'center'
    },
    {
      key: 'name',
      title: 'Name',
      sortable: true
    },
    {
      key: 'status',
      title: 'Status'
    },
    {
      key: 'created_at',
      title: 'Created',
      sortable: true
    }
  ])

  const searchKeys = computed(() => columns.value.map((column) => column.key))

  async function load() {
    pending.value = true
    errorMsg.value = null
    try {
      // Prototype: mock at boundary — swap to service.search on /wire
      const result = await hotelMockSearch(query.value)
      items.value = result.items
      total.value = result.total ?? result.items.length
    } catch (error: unknown) {
      errorMsg.value = (error as Error)?.message ?? 'Cannot load Admin hotel list'
      items.value = []
      total.value = null
    } finally {
      pending.value = false
    }
  }

  function onSearch() {
    return load()
  }

  function onReset() {
    query.value = {}
    return load()
  }

  return {
    pending,
    errorMsg,
    items,
    total,
    query,
    filters,
    columns,
    searchKeys,
    load,
    onSearch,
    onReset,
    service
  }
}
