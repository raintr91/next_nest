import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SampleItemController } from './sample-item/sample-item.controller'
import { SampleItemEntity } from './sample-item/sample-item.entity'
import { SearchSampleItemHandler } from './sample-item/queries/search-sample-item.handler'
import { CreateSampleItemHandler } from './sample-item/commands/create-sample-item.handler'
import { UpdateSampleItemHandler } from './sample-item/commands/update-sample-item.handler'
import { DeleteSampleItemHandler } from './sample-item/commands/delete-sample-item.handler'

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([SampleItemEntity])],
  controllers: [SampleItemController],
  providers: [
    SearchSampleItemHandler,
    CreateSampleItemHandler,
    UpdateSampleItemHandler,
    DeleteSampleItemHandler
  ]
})
export class ExampleModule {}
