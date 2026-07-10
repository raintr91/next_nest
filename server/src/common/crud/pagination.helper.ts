export type PaginationMeta = {
  current_page: number
  per_page: number
  last_page: number
  total: number
}

export type PaginatedResult<T> = {
  items: T[]
  meta: PaginationMeta
}

export type SearchQueryDto = {
  page?: number
  per_page?: number
  all?: boolean | string | number
  order_by?: string
  sorted_by?: string
}

export function shouldPaginate(dto: SearchQueryDto): boolean {
  if (dto.all === true || dto.all === 1 || dto.all === '1') return false
  return true
}

export function resolvePerPage(dto: SearchQueryDto, max = 100, fallback = 15): number {
  const raw = Number(dto.per_page ?? fallback)
  return Math.min(Math.max(raw, 1), max)
}

export function resolvePage(dto: SearchQueryDto): number {
  return Math.max(Number(dto.page ?? 1), 1)
}

export function toPaginatedEnvelope<T>(items: T[], total: number, dto: SearchQueryDto): PaginatedResult<T> {
  const perPage = resolvePerPage(dto)
  const page = resolvePage(dto)
  const lastPage = Math.max(Math.ceil(total / perPage), 1)

  return {
    items,
    meta: {
      current_page: page,
      per_page: perPage,
      last_page: lastPage,
      total
    }
  }
}
