import { describe, expect, it, vi, beforeEach } from 'vitest'

import { mockNuxtApiFetch } from '~/tests/unit/_helpers/nuxtGlobals'

const mockSearch = vi.fn()

vi.mock('~/mocks/admin-hotel.mock', () => ({
  adminHotelMockSearch: (...args: unknown[]) => mockSearch(...args)
}))

import { useAdminHotelList } from '~/composables/admin-hotel/useAdminHotelList'

describe('composables/admin-hotel/useAdminHotelList', () => {
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

  beforeEach(() => {
    mockSearch.mockReset()
    mockNuxtApiFetch.mockReset()
    mockSearch.mockResolvedValue({ items: [validRow], total: 1 })
  })

  it('load() fills items and total from prototype mock search', async () => {
    const { load, items, total, pending } = useAdminHotelList()

    await load()

    expect(mockSearch).toHaveBeenCalled()
    expect(items.value).toHaveLength(1)
    expect(items.value[0]).toEqual(validRow)
    expect(total.value).toBe(1)
    expect(pending.value).toBe(false)
  })

  it('onReset() restores default per_page and reloads', async () => {
    const { onReset, query } = useAdminHotelList()

    query.value = { per_page: 20, page: 2 }
    await onReset()

    expect(query.value).toEqual({ per_page: 100 })
    expect(mockSearch).toHaveBeenCalled()
  })
})
