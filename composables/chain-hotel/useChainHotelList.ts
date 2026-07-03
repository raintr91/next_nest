import type { SearchFilterConfig } from '~/components/molecules/form/searchFilterTypes'
import type { DataTableColumn } from '~/components/molecules/layout/useDataTableLogic'
import { createChainHotelService } from '~/services/chain-hotel.service'
import { chainHotelMockSearch } from '~/mocks/chain-hotel.mock'

function defaultExportMonth(): string {
  const date = new Date()
  date.setMonth(date.getMonth() - 1)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

/**
 * Chain — danh sách hotel (施設一覧) — list composable (portal-gen).
 * Mock boundary: replace chainHotelMockSearch with service.search on /wire.
 */
export function useChainHotelList() {
  const { $apiFetch } = useNuxtApp()
  const service = createChainHotelService($apiFetch)

  const pending = ref(false)
  const errorMsg = ref<string | null>(null)
  const items = ref<Record<string, unknown>[]>([])
  const total = ref<number | null>(null)
  const query = ref<Record<string, unknown>>({ per_page: 100 })
  const exportMonth = ref(defaultExportMonth())
  const exportPending = ref(false)

  const filters = computed<SearchFilterConfig[]>(() => [
  ])

  const columns = computed<DataTableColumn[]>(() => [
    {
      key: 'id',
      title: 'ID',
      align: 'center'
    },
    {
      key: 'name',
      title: '店舗名'
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
      const result = await chainHotelMockSearch(query.value)
      items.value = result.items
      total.value = result.total ?? result.items.length
    } catch (error: unknown) {
      errorMsg.value = (error as Error)?.message ?? 'Cannot load Chain — danh sách hotel (施設一覧)'
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

  async function exportOpenRateReport() {
    exportPending.value = true
    try {
      await service.exportReport({ month: exportMonth.value })
    } catch (error) {
      console.error('exportOpenRateReport failed', error)
      throw error
    } finally {
      exportPending.value = false
    }
  }

  async function loginAsStoreManager(manager: { id: number }) {
    const auth = useAuth()
    try {
      const data = await service.loginFromAdmin({ id: manager.id })
      if (!import.meta.client) return

      const params = new URLSearchParams({
        hotel_name: String(data.hotel_name ?? ''),
        token: String(data.token ?? ''),
        user_name: String(data.user_name ?? ''),
        id_admin: String(auth.user?.id ?? ''),
        use_restaurant: String(data.use_restaurant ?? ''),
        user_id: String(data.user_id ?? manager.id)
      })
      window.open(`${window.location.origin}/store/?${params.toString()}`, '_blank')
    } catch {
      if (import.meta.client) {
        window.alert('ストアとしてのログインに失敗しました。')
      }
    }
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
    exportMonth,
    exportPending,
    exportOpenRateReport,
    loginAsStoreManager
  }
}
