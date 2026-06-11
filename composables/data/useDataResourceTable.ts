import { createDataService } from '~/services/data.service'

type UseDataResourceTableOptions = {
  title: string
  endpoint: string
  requestPath?: string
  method?: 'GET' | 'POST'
}

export function useDataResourceTable(options: UseDataResourceTableOptions) {
  const { $apiFetch } = useNuxtApp()
  const dataService = createDataService($apiFetch)

  const pending = ref(false)
  const errorMsg = ref<string | null>(null)
  const items = ref<Record<string, unknown>[]>([])
  const totalRecords = ref<number | null>(null)

  const searchPath = computed(() => options.requestPath || `${options.endpoint}/search`)

  async function fetchItems() {
    pending.value = true
    errorMsg.value = null
    try {
      const result = await dataService.search(searchPath.value, options.method ?? 'POST', {
        page: 1,
        per_page: 100
      })
      items.value = result.items
      totalRecords.value = result.total
    } catch (error: unknown) {
      errorMsg.value = (error as Error)?.message || `Cannot load ${options.title}`
      items.value = []
      totalRecords.value = null
    } finally {
      pending.value = false
    }
  }

  onMounted(fetchItems)

  return {
    pending,
    errorMsg,
    items,
    totalRecords,
    fetchItems
  }
}
