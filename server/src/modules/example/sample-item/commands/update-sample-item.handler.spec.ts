import { UpdateSampleItemHandler } from './update-sample-item.handler'
import { UpdateSampleItemCommand } from './update-sample-item.command'
import { SampleItemEntity } from '../sample-item.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Test } from '@nestjs/testing'

describe('UpdateSampleItemHandler', () => {
  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn(),
    findOneOrFail: jest.fn().mockResolvedValue({ id: 1, name: 'Updated' })
  }

  async function createHandler() {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateSampleItemHandler,
        { provide: getRepositoryToken(SampleItemEntity), useValue: mockRepo }
      ]
    }).compile()
    return moduleRef.get(UpdateSampleItemHandler)
  }

  it('updates entity and returns dto', async () => {
    const handler = await createHandler()
    const result = await handler.execute(new UpdateSampleItemCommand(1, { name: 'Updated' }))
    expect(result).toMatchObject({ id: 1, name: 'Updated' })
    expect(mockRepo.update).toHaveBeenCalled()
  })
})
