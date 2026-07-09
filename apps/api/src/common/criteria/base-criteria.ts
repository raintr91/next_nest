import type { SearchQueryDto } from '../crud/pagination.helper'

export type AllowedFilter = [string, '=' | 'like' | 'in']
export type CriteriaInput = {
  filters?: Record<string, unknown>
  sorts?: { order_by?: string; sorted_by?: string }
  includes?: string[]
}

/**
 * Port of Laravel BaseCriteria — filter/sort/include allow-lists.
 * Repository layer applies these to TypeORM/Prisma query builders.
 */
export class BaseCriteria {
  constructor(
    private readonly allowedFilters: AllowedFilter[] = [],
    private readonly allowedSorts: string[] = [],
    private readonly allowedIncludes: string[] = []
  ) {}

  normalize(dto: SearchQueryDto & CriteriaInput) {
    return {
      filters: this.pickFilters(dto.filters ?? {}),
      sort: this.pickSort(dto),
      includes: this.pickIncludes(dto.includes ?? [])
    }
  }

  private pickFilters(filters: Record<string, unknown>) {
    const allowed = new Map(this.allowedFilters.map(([field, op]) => [field, op]))
    return Object.fromEntries(
      Object.entries(filters).filter(([field]) => allowed.has(field))
    )
  }

  private pickSort(dto: SearchQueryDto) {
    const orderBy = dto.order_by
    if (!orderBy || !this.allowedSorts.includes(orderBy)) return null
    return { order_by: orderBy, sorted_by: dto.sorted_by ?? 'desc' }
  }

  private pickIncludes(includes: string[]) {
    return includes.filter((name) => this.allowedIncludes.includes(name))
  }
}
