import { describe, expect, it } from 'vitest'

import { createAdminHotelService } from '~/services/admin-hotel.service'
import { mockApiFetch } from '~/tests/unit/_helpers/mockApiFetch'

describe('services/admin-hotel.service', () => {
  const validRow = {
  "id": 1,
  "name": "Danh sách hotel admin A",
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

    const result = await createAdminHotelService(apiFetch).search({ page: 1, per_page: 100 })

    expect(apiFetch).toHaveBeenCalledWith('/hotels', {
      method: 'GET',
      query: { page: 1, per_page: 100 }
    })
    expect(result.items).toHaveLength(1)
    expect(result.items[0]).toEqual(validRow)
  })
})
