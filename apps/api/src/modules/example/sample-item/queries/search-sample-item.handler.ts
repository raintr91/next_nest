import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { toPaginatedEnvelope } from '../../../../common/crud/pagination.helper'
import { SampleItemEntity } from '../sample-item.entity'
import { SearchSampleItemQuery } from './search-sample-item.query'
import { SampleItemResource } from '../sample-item.resource'

@QueryHandler(SearchSampleItemQuery)
export class SearchSampleItemHandler implements IQueryHandler<SearchSampleItemQuery> {
  constructor(
    @InjectRepository(SampleItemEntity)
    private readonly repository: Repository<SampleItemEntity>
  ) {}

  async execute(query: SearchSampleItemQuery) {
    const page = Number(query.dto.page ?? 1)
    const perPage = Number(query.dto.per_page ?? 15)
    const skip = (page - 1) * perPage

    const [items, total] = await this.repository.findAndCount({
      skip,
      take: perPage,
      order: { id: 'DESC' }
    })

    const envelope = toPaginatedEnvelope(
      items.map((row) => SampleItemResource.toDto(row)),
      total,
      { page, per_page: perPage }
    )

    return { data: envelope.items, meta: { pagination: envelope.meta } }
  }
}
