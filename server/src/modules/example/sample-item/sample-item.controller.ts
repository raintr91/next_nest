import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

import { SearchSampleItemQuery } from './queries/search-sample-item.query'
import { CreateSampleItemCommand } from './commands/create-sample-item.command'
import { UpdateSampleItemCommand } from './commands/update-sample-item.command'
import { DeleteSampleItemCommand } from './commands/delete-sample-item.command'

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

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.commandBus.execute(new CreateSampleItemCommand(body))
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.commandBus.execute(new UpdateSampleItemCommand(id, body))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteSampleItemCommand(id))
  }
}
