import { SearchSampleItemHandler } from './search-sample-item.handler'
import { SearchSampleItemQuery } from './search-sample-item.query'
import { SampleItemEntity } from '../sample-item.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Test } from '@nestjs/testing'

describe('SearchSampleItemHandler', () => {
  const mockRepo = {
    findAndCount: jest.fn().mockResolvedValue([[], 0])
  }

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  async function createHandler() {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SearchSampleItemHandler,
        { provide: getRepositoryToken(SampleItemEntity), useValue: mockRepo }
      ]
    }).compile()
    return moduleRef.get(SearchSampleItemHandler)
  }

  it('returns paginated envelope', async () => {
    const handler = await createHandler()
    const result = await handler.execute(new SearchSampleItemQuery({ page: 1, per_page: 10 }))
    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('meta')
    expect(mockRepo.findAndCount).toHaveBeenCalled()
  })
})
