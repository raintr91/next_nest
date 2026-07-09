import { describe, expect, it } from 'vitest'

import { createSampleItemService } from '@/services/sample-item.service'
import { mockApiFetch } from '../_helpers/mockApiFetch'

describe('services/sample-item.service', () => {
  const validRow = {
  "id": 1,
  "name": "Contract gen pilot A",
  "managers": [
    {
      "id": 101,
      "full_name": "Manager A"
    }
  ]
} as const

  it('search calls list endpoint and parses list envelope', async () => {
    const apiFetch = mockApiFetch({
      success: true,
      data: { items: [validRow], total: 1 }
    })

    const result = await createSampleItemService(apiFetch).search({ page: 1, per_page: 100 })

    expect(apiFetch).toHaveBeenCalledWith('/sample-items', {
      method: 'GET',
      query: { page: 1, per_page: 100 }
    })
    expect(result.items).toHaveLength(1)
    expect(result.items[0]).toEqual(validRow)
  })
})
