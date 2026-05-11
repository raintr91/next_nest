import type { BreadcrumbItem } from '~/components/molecules/navigation/BreadcrumbNav.vue'

const commonBreadcrumbExtras = useState<BreadcrumbItem[]>('common-breadcrumb-extras', () => [])

export function useCommonBreadcrumbState() {
  return commonBreadcrumbExtras
}

export function setCommonBreadcrumbExtras(items: BreadcrumbItem[]) {
  commonBreadcrumbExtras.value = items
}

export function clearCommonBreadcrumbExtras() {
  commonBreadcrumbExtras.value = []
}
