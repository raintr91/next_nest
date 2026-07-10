import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseWriteHandler } from '../../../../common/crud/base-write.handler'
import { createTypeormWriteRepository } from '../../../../common/persistence/typeorm-write.repository'
import { SampleItemEntity } from '../sample-item.entity'
import { SampleItemResource } from '../sample-item.resource'
import { UpdateSampleItemCommand } from './update-sample-item.command'

@CommandHandler(UpdateSampleItemCommand)
export class UpdateSampleItemHandler
  extends BaseWriteHandler<SampleItemEntity>
  implements ICommandHandler<UpdateSampleItemCommand>
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

  async execute(command: UpdateSampleItemCommand) {
    const entity = await this.update(command.id, command.dto, [])
    return SampleItemResource.toDto(entity)
  }
}
