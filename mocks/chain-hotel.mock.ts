import type { ChainHotelListResponse } from '~/models/chain-hotel/chain-hotel.types'

const PAGE_SIZE = 100

const mockItemsPage1: Record<string, unknown>[] = [
  {
    "id": 1,
    "name": "Chain — danh sách hotel (施設一覧) A",
    "managers": [
      {
        "id": 101,
        "full_name": "Manager A"
      }
    ]
  },
  {
    "id": 2,
    "name": "Chain — danh sách hotel (施設一覧) B",
    "managers": [
      {
        "id": 102,
        "full_name": "Manager B"
      }
    ]
  },
  {
    "id": 3,
    "name": "Chain — danh sách hotel (施設一覧) C",
    "managers": [
      {
        "id": 103,
        "full_name": "Manager C"
      }
    ]
  }
]

const mockItemsPage2: Record<string, unknown>[] = [
  {
    "id": 101,
    "name": "Chain — danh sách hotel (施設一覧) A (page 2)",
    "managers": [
      {
        "id": 101,
        "full_name": "Manager A"
      }
    ]
  },
  {
    "id": 102,
    "name": "Chain — danh sách hotel (施設一覧) B (page 2)",
    "managers": [
      {
        "id": 102,
        "full_name": "Manager B"
      }
    ]
  },
  {
    "id": 103,
    "name": "Chain — danh sách hotel (施設一覧) C (page 2)",
    "managers": [
      {
        "id": 103,
        "full_name": "Manager C"
      }
    ]
  }
]

/** Prototype mock — ≥2 pages for pagination (portal-gen). */
export async function chainHotelMockSearch(
  query: Record<string, unknown>
): Promise<ChainHotelListResponse> {
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

export const chainHotelMockPageSize = PAGE_SIZE
