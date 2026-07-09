import { CreateSampleItemHandler } from './create-sample-item.handler'
import { CreateSampleItemCommand } from './create-sample-item.command'
import { SampleItemEntity } from '../sample-item.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Test } from '@nestjs/testing'

describe('CreateSampleItemHandler', () => {
  const mockRepo = {
    create: jest.fn((row) => row),
    save: jest.fn(async (row) => ({ id: 1, ...row })),
    update: jest.fn(),
    delete: jest.fn(),
    findOneOrFail: jest.fn()
  }

  async function createHandler() {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateSampleItemHandler,
        { provide: getRepositoryToken(SampleItemEntity), useValue: mockRepo }
      ]
    }).compile()
    return moduleRef.get(CreateSampleItemHandler)
  }

  it('creates entity and returns dto', async () => {
    const handler = await createHandler()
    const result = await handler.execute(new CreateSampleItemCommand({ name: 'Pilot' }))
    expect(result).toHaveProperty('id')
    expect(mockRepo.save).toHaveBeenCalled()
  })
})
