import { describe, expect, it, vi, beforeEach } from 'vitest'

import { mockNuxtApiFetch } from '~/tests/unit/_helpers/nuxtGlobals'

const mockSearch = vi.fn()

vi.mock('~/mocks/chain-hotel.mock', () => ({
  chainHotelMockSearch: (...args: unknown[]) => mockSearch(...args)
}))

import { useChainHotelList } from '~/composables/chain-hotel/useChainHotelList'

describe('composables/chain-hotel/useChainHotelList', () => {
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

  beforeEach(() => {
    mockSearch.mockReset()
    mockNuxtApiFetch.mockReset()
    mockSearch.mockResolvedValue({ items: [validRow], total: 1 })
  })

  it('load() fills items and total from prototype mock search', async () => {
    const { load, items, total, pending } = useChainHotelList()

    await load()

    expect(mockSearch).toHaveBeenCalled()
    expect(items.value).toHaveLength(1)
    expect(items.value[0]).toEqual(validRow)
    expect(total.value).toBe(1)
    expect(pending.value).toBe(false)
  })

  it('onReset() restores default per_page and reloads', async () => {
    const { onReset, query } = useChainHotelList()

    query.value = { per_page: 20, page: 2 }
    await onReset()

    expect(query.value).toEqual({ per_page: 100 })
    expect(mockSearch).toHaveBeenCalled()
  })
  it('exportOpenRateReport() calls service export with month', async () => {
    mockNuxtApiFetch.mockResolvedValue({
      success: true,
      code: 200,
      message: 'OK',
      data: { ok: true },
      meta: null,
      trace_id: null
    })
    const { exportOpenRateReport, exportMonth, exportPending } = useChainHotelList()

    exportMonth.value = '2025-05'
    await exportOpenRateReport()

    expect(mockNuxtApiFetch).toHaveBeenCalledWith('/hotels/export-report', {
      method: 'POST',
      body: { month: '2025-05' }
    })
    expect(exportPending.value).toBe(false)
  })
})
