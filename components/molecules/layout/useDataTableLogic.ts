import { computed, ref, watch } from 'vue'
import {
  filterItemsBySearch,
  getNextSortState,
  getTotalPages,
  paginateItems,
  sortItems,
  type SortOrder
} from '~/components/molecules/layout/dataTableLogic'

export interface DataTableColumn {
  key: string
  title: string
  sortable?: boolean
  overflow?: 'nowrap' | 'truncate-tooltip' | 'wrap-2-lines' | 'wrap-free'
  align?: 'left' | 'center' | 'right'
  maxWidth?: string
}

export interface UseDataTableLogicProps {
  columns: DataTableColumn[]
  items: Record<string, unknown>[]
  pageSize?: number
  searchKeys?: string[]
}

export function useDataTableLogic(props: UseDataTableLogicProps) {
  const search = ref('')
  const sortKey = ref<string | null>(null)
  const sortOrder = ref<SortOrder>('asc')
  const page = ref(1)

  const searchKeys = computed(() => props.searchKeys ?? props.columns.map((c) => c.key))

  const filteredItems = computed(() =>
    filterItemsBySearch(props.items, search.value, searchKeys.value)
  )

  const sortedItems = computed(() =>
    sortItems(filteredItems.value, sortKey.value, sortOrder.value)
  )

  const totalPages = computed(() =>
    getTotalPages(sortedItems.value.length, props.pageSize ?? 10)
  )

  const paginatedItems = computed(() =>
    paginateItems(sortedItems.value, page.value, props.pageSize ?? 10)
  )

  function toggleSort(key: string) {
    const next = getNextSortState(sortKey.value, sortOrder.value, key)
    sortKey.value = next.sortKey
    sortOrder.value = next.sortOrder
  }

  function goPrev() {
    if (page.value > 1) page.value--
  }

  function goNext() {
    if (page.value < totalPages.value) page.value++
  }

  watch(
    () => sortedItems.value.length,
    () => {
      if (page.value > totalPages.value) {
        page.value = Math.max(1, totalPages.value)
      }
    }
  )

  return {
    search,
    sortKey,
    sortOrder,
    page,
    searchKeys,
    filteredItems,
    sortedItems,
    totalPages,
    paginatedItems,
    toggleSort,
    goPrev,
    goNext
  }
}
