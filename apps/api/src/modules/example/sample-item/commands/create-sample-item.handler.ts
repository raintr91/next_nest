import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseWriteHandler } from '../../../../common/crud/base-write.handler'
import { createTypeormWriteRepository } from '../../../../common/persistence/typeorm-write.repository'
import { SampleItemEntity } from '../sample-item.entity'
import { SampleItemResource } from '../sample-item.resource'
import { CreateSampleItemCommand } from './create-sample-item.command'

@CommandHandler(CreateSampleItemCommand)
export class CreateSampleItemHandler
  extends BaseWriteHandler<SampleItemEntity>
  implements ICommandHandler<CreateSampleItemCommand>
{
  protected repository: ReturnType<typeof createTypeormWriteRepository<SampleItemEntity>>

  constructor(
    @InjectRepository(SampleItemEntity)
    typeormRepo: Repository<SampleItemEntity>
  ) {
    super()
    this.repository = createTypeormWriteRepository(typeormRepo)
  }

  protected async refresh(entity: SampleItemEntity) {
    return entity
  }

  async execute(command: CreateSampleItemCommand) {
    const entity = await this.create(command.dto, [])
    return SampleItemResource.toDto(entity)
  }
}
