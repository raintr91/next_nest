import type { HotelListResponse } from '~/models/hotel/hotel.types'

const PAGE_SIZE = 10

const mockItemsPage1: Record<string, unknown>[] = [
  { id: 1, name: 'Admin hotel list A', status: 'active', created_at: '2026-01-01T00:00:00Z' },
  { id: 2, name: 'Admin hotel list B', status: 'inactive', created_at: '2026-01-02T00:00:00Z' },
  { id: 3, name: 'Admin hotel list C', status: 'active', created_at: '2026-01-03T00:00:00Z' }
]

const mockItemsPage2: Record<string, unknown>[] = [
  { id: 4, name: 'Admin hotel list D', status: 'active', created_at: '2026-01-04T00:00:00Z' },
  { id: 5, name: 'Admin hotel list E', status: 'inactive', created_at: '2026-01-05T00:00:00Z' }
]

/** Prototype mock — ≥2 pages for pagination (portal-gen). */
export async function hotelMockSearch(
  query: Record<string, unknown>
): Promise<HotelListResponse> {
  const page = Number(query.page ?? 1)
  const name = String(query.name ?? '').toLowerCase()

  let items = page <= 1 ? [...mockItemsPage1] : [...mockItemsPage2]
  if (name) {
    items = items.filter((row) => String(row.name ?? '').toLowerCase().includes(name))
  }

  return {
    items,
    total: mockItemsPage1.length + mockItemsPage2.length
  }
}

export const hotelMockPageSize = PAGE_SIZE
