import { BaseCriteria } from '../criteria/base-criteria'
import {
  type PaginatedResult,
  type SearchQueryDto,
  resolvePage,
  resolvePerPage,
  shouldPaginate,
  toPaginatedEnvelope
} from './pagination.helper'

export type ReadRepository<TEntity> = {
  findMany: (options: Record<string, unknown>) => Promise<TEntity[]>
  count: (options: Record<string, unknown>) => Promise<number>
  findById: (id: number | string, options?: Record<string, unknown>) => Promise<TEntity | null>
}

/**
 * Port of Laravel BaseQuery — read-side orchestration for QueryHandlers.
 */
export abstract class BaseReadQuery<TEntity, TDto extends SearchQueryDto> {
  protected abstract repository: ReadRepository<TEntity>
  protected abstract criteria: BaseCriteria
  protected abstract toDto(entity: TEntity): unknown

  protected filters(): Array<[string, '=' | 'like' | 'in']> {
    return []
  }

  protected sorts(): string[] {
    return ['id', 'created_at']
  }

  protected includes(): string[] {
    return []
  }

  async paginate(dto: TDto): Promise<PaginatedResult<unknown>> {
    const normalized = this.criteria.normalize({
      ...dto,
      includes: (dto as { includes?: string[] }).includes
    })

    const baseOptions = { ...normalized }

    if (!shouldPaginate(dto)) {
      const items = await this.repository.findMany(baseOptions)
      return toPaginatedEnvelope(items.map((row) => this.toDto(row)), items.length, {
        ...dto,
        page: 1,
        per_page: items.length || 1
      })
    }

    const perPage = resolvePerPage(dto)
    const page = resolvePage(dto)
    const [items, total] = await Promise.all([
      this.repository.findMany({ ...baseOptions, page, per_page: perPage }),
      this.repository.count(baseOptions)
    ])

    return toPaginatedEnvelope(items.map((row) => this.toDto(row)), total, dto)
  }

  async findById(id: number | string) {
    const entity = await this.repository.findById(id)
    return entity ? this.toDto(entity) : null
  }

  async stats(key: string): Promise<Record<string, number>> {
    const total = await this.repository.count({})
    return { [key]: total }
  }
}
