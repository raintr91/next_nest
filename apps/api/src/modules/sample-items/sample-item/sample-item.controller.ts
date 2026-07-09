import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

import { SearchSampleItemQuery } from './queries/search-sample-item.query'

@Controller('sample-items')
export class SampleItemController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @Get()
  search(@Query() query: Record<string, unknown>) {
    return this.queryBus.execute(new SearchSampleItemQuery(query))
  }



}
