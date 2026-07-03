import { describe, expect, it } from 'vitest'

import { createChainHotelService } from '~/services/chain-hotel.service'
import { mockApiFetch } from '~/tests/unit/_helpers/mockApiFetch'

describe('services/chain-hotel.service', () => {
  const validRow = {
  "id": 1,
  "name": "Chain — danh sách hotel (施設一覧) A",
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

    const result = await createChainHotelService(apiFetch).search({ page: 1, per_page: 100 })

    expect(apiFetch).toHaveBeenCalledWith('/hotels', {
      method: 'GET',
      query: { page: 1, per_page: 100 }
    })
    expect(result.items).toHaveLength(1)
    expect(result.items[0]).toEqual(validRow)
  })
})
