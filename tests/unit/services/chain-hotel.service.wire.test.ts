import { describe, expect, it, vi } from 'vitest'

import { createChainHotelService } from '~/services/chain-hotel.service'
import { mockApiFetch } from '~/tests/unit/_helpers/mockApiFetch'

describe('services/chain-hotel.service wire', () => {
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

  it('search rejects API error envelope', async () => {
    const apiFetch = mockApiFetch({ success: false, message: 'List failed' })

    await expect(
      createChainHotelService(apiFetch).search({ page: 1 })
    ).rejects.toThrow()
  })

  it('search parses meta.total when present', async () => {
    const apiFetch = mockApiFetch({
      success: true,
      data: { items: [validRow], total: 42, meta: { total: 42 } }
    })

    const result = await createChainHotelService(apiFetch).search({ page: 1 })

    expect(result.total).toBe(42)
    expect(result.items[0]).toEqual(validRow)
  })
  it('exportReport propagates apiFetch rejection', async () => {
    const apiFetch = vi.fn().mockRejectedValue(new Error('export failed'))

    await expect(
      createChainHotelService(apiFetch).exportReport({ month: '2025-05' })
    ).rejects.toThrow('export failed')
  })
})
