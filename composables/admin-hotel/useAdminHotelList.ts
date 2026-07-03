import type { SearchFilterConfig } from '~/components/molecules/form/searchFilterTypes'
import type { DataTableColumn } from '~/components/molecules/layout/useDataTableLogic'
import { createAdminHotelService } from '~/services/admin-hotel.service'
import { adminHotelMockSearch } from '~/mocks/admin-hotel.mock'

function defaultExportMonth(): string {
  const date = new Date()
  date.setMonth(date.getMonth() - 1)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

/**
 * Danh sách hotel admin — list composable (portal-gen).
 * Mock boundary: replace adminHotelMockSearch with service.search on /wire.
 */
export function useAdminHotelList() {
  const { $apiFetch } = useNuxtApp()
  const service = createAdminHotelService($apiFetch)

  const pending = ref(false)
  const errorMsg = ref<string | null>(null)
  const items = ref<Record<string, unknown>[]>([])
  const total = ref<number | null>(null)
  const query = ref<Record<string, unknown>>({ per_page: 100 })

  const filters = computed<SearchFilterConfig[]>(() => [
    {
      name: 'created_at',
      label: 'Created at',
      type: 'date'
    },
    {
      name: 'name',
      label: '施設名',
      type: 'text_field'
    },
    {
      name: 'code',
      label: '施設コード',
      type: 'text_field'
    },
    {
      name: 'chain_name',
      label: 'Chain',
      type: 'text_field'
    },
    {
      name: 'activate_status',
      label: 'Status',
      type: 'select'
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
      title: '施設名',
      sortable: true
    },
    {
      key: 'code',
      title: '施設コード'
    },
    {
      key: 'chain',
      title: 'Chain'
    },
    {
      key: 'created_at',
      title: 'Created at',
      sortable: true
    },
    {
      key: 'managers',
      title: 'Login'
    }
  ])

  const searchKeys = computed(() => columns.value.map((column) => column.key))

  const perPage = computed({
    get: () => Number(query.value.per_page ?? 100),
    set: (value: number) => {
      query.value = { ...query.value, per_page: value, page: 1 }
    }
  })

  function onPerPageChange() {
    return load()
  }

  async function load() {
    pending.value = true
    errorMsg.value = null
    try {
      const result = await adminHotelMockSearch(query.value)
      items.value = result.items
      total.value = result.total ?? result.items.length
    } catch (error: unknown) {
      errorMsg.value = (error as Error)?.message ?? 'Cannot load Danh sách hotel admin'
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
    query.value = { per_page: 100 }
    return load()
  }


  async function loginAsStoreManager(manager: { id: number }) {
    // Prototype: wire POST /auth/store/login-from-admin on /wire
    console.info('loginAsStoreManager', manager.id)
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
    service,
    perPage,
    onPerPageChange,
    loginAsStoreManager
  }
}
