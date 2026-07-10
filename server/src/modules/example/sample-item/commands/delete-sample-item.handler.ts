import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseWriteHandler } from '../../../../common/crud/base-write.handler'
import { createTypeormWriteRepository } from '../../../../common/persistence/typeorm-write.repository'
import { SampleItemEntity } from '../sample-item.entity'
import { DeleteSampleItemCommand } from './delete-sample-item.command'

@CommandHandler(DeleteSampleItemCommand)
export class DeleteSampleItemHandler
  extends BaseWriteHandler<SampleItemEntity>
  implements ICommandHandler<DeleteSampleItemCommand>
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

  async execute(command: DeleteSampleItemCommand) {
    await this.delete(command.id)
    return { success: true }
  }
}
