import { DeleteSampleItemHandler } from './delete-sample-item.handler'
import { DeleteSampleItemCommand } from './delete-sample-item.command'
import { SampleItemEntity } from '../sample-item.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Test } from '@nestjs/testing'

describe('DeleteSampleItemHandler', () => {
  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    findOneOrFail: jest.fn()
  }

  async function createHandler() {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteSampleItemHandler,
        { provide: getRepositoryToken(SampleItemEntity), useValue: mockRepo }
      ]
    }).compile()
    return moduleRef.get(DeleteSampleItemHandler)
  }

  it('deletes entity', async () => {
    const handler = await createHandler()
    const result = await handler.execute(new DeleteSampleItemCommand(1))
    expect(result).toEqual({ success: true })
    expect(mockRepo.delete).toHaveBeenCalledWith(1)
  })
})
